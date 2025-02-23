const express = require('express')
const bodyParser =  require('body-parser')
const multer = require('multer')
const cors = require('cors')

const client =  require('./connection')
const app = express()
const port = 3001
const path = require('path')
const routes = require('./route');

app.use(express.static(path.join(__dirname, 'views')));
app.use("/public",express.static('public'));

app.use('/', routes);
app.use(cors())
app.use(bodyParser.json())

app.listen(port, () => {
    console.log(`listen to port ${port}`)
})

client.connect(err=> {
    if(err){
        console.log(err.message)
    } else {
        console.log('Database Berhasil Terkoneksi')
    }
})


// Konfigurasi Multer

const storage = multer.diskStorage({
    destination: "public",
    filename: (req, file, cb) => cb(null, file.originalname), 
});
const upload = multer({ storage })



app.get('/siswa', (req,res) => {
    client.query(`select * from siswa`, (err, result) => {
        if(!err){
            res.send(result.rows)
        }
    })
})

app.get('/siswa/:id', (req,res) => {
    const id = parseInt(req.params.id)
    client.query(`select * from siswa where id ='${id}'`, (err, result) => {
        if(!err){
            res.send(result.rows)
        }
    })
})



app.post('/siswa', upload.single('foto'), (req, res) => {
    const {  nama_lengkap, jenis_kelamin, tanggal_daftar, kelas } = req.body;
    const imagePath = req.file ? `/public/${req.file.filename}` : null; 

    const query = `INSERT INTO siswa (foto,  nama_lengkap, jenis_kelamin, tanggal_daftar, kelas) VALUES ($1, $2, $3, $4, $5)`;

    client.query(query, [imagePath,  nama_lengkap, jenis_kelamin, tanggal_daftar, kelas], (err, result) => {
        if (err) {
            console.error("Error saat menambahkan data:", err.message);
            res.status(500).send({ error: err.message });
        } else {
            res.send({ message: "Data Berhasil Ditambahkan", data: req.body });
        }
    });
});

app.put('/siswa/:id', upload.single('foto'), (req, res) => {
    const id = parseInt(req.params.id)
    const {  nama_lengkap, jenis_kelamin, tanggal_daftar, kelas } = req.body;
    const imagePath = req.file ? `/public/${req.file.filename}` : null; 

    client.query(`update siswa SET foto = '${imagePath}', nama_lengkap = '${nama_lengkap}', jenis_kelamin = '${jenis_kelamin}', tanggal_daftar = '${tanggal_daftar}',
        kelas = '${kelas}' WHERE id = '${id}' `, (err, result) => {
        if (!err) {
            res.send("Data Berhasil Diperbarui")
        } else {
            res.send(err.message)
        }
    });
});




app.delete('/siswa/:id', (req,res) => {
    const id = parseInt(req.params.id)
    client.query(`delete from siswa where id = '${id}'`, (err,result) => {
        if(!err){
            res.send('Berhasil menghapus data')
        } else {
            res.send(err.message)
        }
    } )
})

