const express = require(`express`);
const router = express.Router();
const connection = require(`../config/database`);

router.get(`/`, (req,res,next) => {
    connection.query(`SELECT * FROM penyimpanan LEFT JOIN ruangan ON penyimpanan.id_ruangan = ruangan.id_ruangan LEFT JOIN pegawai ON pegawai.id_pegawai = ruangan.pic ORDER BY id_penyimpanan DESC`,(err, rows) => {
        console.log(rows)
        if(err){
            req.flash(err)
        }else{
            res.render(`penyimpanan/index`,{
                data: rows
            })
        }
    });
})

router.get(`/create`, (req,res,next) => {
    connection.query(`SELECT * FROM ruangan ORDER BY id_ruangan DESC`,(err, rows) => {
        if(err){
            req.flash(err)
        }else{
            res.render(`penyimpanan/create`,{
                data: rows
            })
        }
    });
})

router.post(`/store`, (req,res,next) => {
    let {nama_penyimpanan, kode_penyimpanan, id_ruangan} = req.body;
    let data = {nama_penyimpanan, kode_penyimpanan, id_ruangan}
    try {
        connection.query(`insert into penyimpanan set ?`, data, (err,rows) => {
            if(err){
                console.log(err);
                res.redirect(`/penyimpanan`)
                return false
            }
            req.flash(`succ`, `Berhasil menambahkan data`)
            res.redirect(`/penyimpanan`)
        })
    } catch (err) {
        req.flash(`err`, err)
        res.redirect(`/penyimpanan`)
    }
})

router.get(`/edit/:id`, (req,res,next) => {
    id = req.params.id
    connection.query(`SELECT * FROM penyimpanan LEFT JOIN ruangan ON penyimpanan.id_ruangan = ruangan.id_ruangan LEFT JOIN pegawai ON pegawai.id_pegawai = ruangan.pic where id_penyimpanan = ${id}`,(err, rows)=>{
        if(err){
            req.flash(err);
        }else{
            connection.query(`SELECT * FROM ruangan ORDER BY id_ruangan DESC`,(err, data) => {
                if(err){
                    req.flash(err)
                }else{
                    rows = rows[0];
                    console.log(data[0].nama_ruangan);
                    res.render(`penyimpanan/edit`,{
                        nama : rows.nama_penyimpanan,
                        kode : rows.kode_penyimpanan,
                        id_ruangan : rows.id_ruangan,
                        id : rows.id_penyimpanan,
                        data,
                    })
                }
            });
        }
    });
})

router.post(`/update/:id`, (req,res,next) => {
    let id = req.params.id
    let {nama_penyimpanan, kode_penyimpanan, id_ruangan} = req.body
    let data = {nama_penyimpanan, kode_penyimpanan, id_ruangan}
    try {
        connection.query(`update penyimpanan set ? where id_penyimpanan = ${id}`, data, (err,rows) => {
            if(err){
                req.flash(`err`, err);
                res.redirect(`/penyimpanan`)
                return false
            }
            req.flash(`succ`, `Berhasil mengubah data`)
            res.redirect(`/penyimpanan`)
        })
    } catch (err) {
        req.flash(`err`, err)
        res.redirect(`/penyimpanan`)
    }
})

router.get(`/delete/:id`, (req,res,next) => {
    let id = req.params.id
    connection.query(`delete from penyimpanan where id_penyimpanan = ${id}`, (err, rows) => {
        if(err){
            console.log(err);
            req.flash(`err`, `query gagal`);
            res.redirect(`/penyimpanan`)
            return false
        }
        req.flash(`succ`, `Berhasil menghapus data`)
        res.redirect(`/penyimpanan`)
    })
})

module.exports = router;