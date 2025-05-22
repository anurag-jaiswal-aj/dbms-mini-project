const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const MONGODB_URI = 'mongodb+srv://janurag582004:2hnD6mp2DssMNOpg@cluster0.o5a2mof.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

const challanSchema = new mongoose.Schema({
    vehicleNumber: { type: String, required: true },
    ownerName: { type: String, required: true },
    violationType: { type: String, required: true },
    amount: { type: Number, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, default: 'Pending' }
});

const Challan = mongoose.model('Challan', challanSchema);

app.post('/api/challans', async (req, res) => {
    try {
        const challan = new Challan(req.body);
        await challan.save();
        res.status(201).json(challan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/api/challans', async (req, res) => {
    try {
        const challans = await Challan.find().sort({ date: -1 });
        res.json(challans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/challans/search/:vehicleNumber', async (req, res) => {
    try {
        const challans = await Challan.find({
            vehicleNumber: { $regex: req.params.vehicleNumber, $options: 'i' }
        });
        res.json(challans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/challans/:id', async (req, res) => {
    try {
        const challan = await Challan.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(challan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/challans/:id', async (req, res) => {
    try {
        await Challan.findByIdAndDelete(req.params.id);
        res.json({ message: 'Challan deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 