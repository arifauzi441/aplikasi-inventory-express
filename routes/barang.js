const express = require(`express`);
const router = express.Router();
const connection = require(`../config/database`);

router.get(`/`, (req,res,next) => {
    connection.query(`SELECT * FROM barang LEFT JOIN penyimpanan ON barang.id_penyimpanan = penyimpanan.id_penyimpanan LEFT JOIN ruangan ON ruangan.id_ruangan = penyimpanan.id_ruangan
    LEFT JOIN pegawai ON pegawai.id_pegawai = ruangan.pic ORDER BY id_barang DESC`,(err, rows) => {
        console.log(rows)
        if(err){
            req.flash(err)
        }else{
            res.render(`barang/index`,{
                data: rows
            })
        }
    });
})

router.get(`/create`, (req,res,next) => {
    connection.query(`SELECT * FROM penyimpanan ORDER BY id_penyimpanan DESC`,(err, rows) => {
        if(err){
            req.flash(err)
        }else{
            res.render(`barang/create`,{
                data: rows
            })
        }
    });
})

router.post(`/store`, (req,res,next) => {
    let {nama_barang, kode_barang, id_penyimpanan, merk_spesifikasi_barang, tahun_perolehan_barang, sumber_perolehan_barang, jumlah_perolehan_barang, kondisi_perolehan_barang,} = req.body;
    let data = {nama_barang, kode_barang, id_penyimpanan, merk_spesifikasi_barang, tahun_perolehan_barang, sumber_perolehan_barang, jumlah_perolehan_barang, kondisi_perolehan_barang,}
    try {
        connection.query(`insert into barang set ?`, data, (err,rows) => {
            if(err){
                console.log(err);
                res.redirect(`/barang`)
                return false
            }
            req.flash(`succ`, `Berhasil menambahkan data`)
            res.redirect(`/barang`)
        })
    } catch (err) {
        req.flash(`err`, err)
        res.redirect(`/barang`)
    }
})

router.get(`/edit/:id`, (req,res,next) => {
    id = req.params.id
    connection.query(`SELECT * FROM barang LEFT JOIN penyimpanan ON barang.id_penyimpanan = penyimpanan.id_penyimpanan LEFT JOIN ruangan ON ruangan.id_ruangan = penyimpanan.id_ruangan LEFT JOIN pegawai ON pegawai.id_pegawai = ruangan.pic where id_barang = ${id}`,(err, rows)=>{
        if(err){
            req.flash(err);
        }else{
            connection.query(`SELECT * FROM penyimpanan ORDER BY id_penyimpanan DESC`,(err, data) => {
                if(err){
                    req.flash(err)
                }else{
                    rows = rows[0]
                    let {nama_barang, kode_barang, id_penyimpanan, id_barang, merk_spesifikasi_barang, tahun_perolehan_barang, sumber_perolehan_barang, jumlah_perolehan_barang, kondisi_perolehan_barang} = rows
                    res.render(`barang/edit`,{
                        nama_barang, 
                        kode_barang, 
                        id_penyimpanan, 
                        id_barang, 
                        merk_spesifikasi_barang, 
                        tahun_perolehan_barang, 
                        sumber_perolehan_barang, 
                        jumlah_perolehan_barang, 
                        kondisi_perolehan_barang,
                        data,
                    })
                }
            });
        }
    });
})

router.post(`/update/:id`, (req,res,next) => {
    let id = req.params.id
    let {nama_barang, kode_barang, id_penyimpanan, merk_spesifikasi_barang, tahun_perolehan_barang, sumber_perolehan_barang, jumlah_perolehan_barang, kondisi_perolehan_barang,} = req.body
    let data = {nama_barang, kode_barang, id_penyimpanan, merk_spesifikasi_barang, tahun_perolehan_barang, sumber_perolehan_barang, jumlah_perolehan_barang, kondisi_perolehan_barang}
    try {
        connection.query(`update barang set ? where id_barang = ${id}`, data, (err,rows) => {
            if(err){
                req.flash(`err`, err);
                res.redirect(`/barang`)
                return false
            }
            req.flash(`succ`, `Berhasil mengubah data`)
            res.redirect(`/barang`)
        })
    } catch (err) {
        req.flash(`err`, err)
        res.redirect(`/barang`)
    }
})

router.get(`/delete/:id`, (req,res,next) => {
    let id = req.params.id
    connection.query(`delete from barang where id_barang = ${id}`, (err, rows) => {
        if(err){
            console.log(err);
            req.flash(`err`, `query gagal`);
            res.redirect(`/barang`)
            return false
        }
        req.flash(`succ`, `Berhasil menghapus data`)
        res.redirect(`/barang`)
    })
})

module.exports = router;