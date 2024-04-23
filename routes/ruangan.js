const express = require(`express`);
const router = express.Router();
const connection = require(`../config/database`);

router.get(`/`, (req,res,next) => {
    connection.query(`SELECT * FROM ruangan LEFT JOIN pegawai ON ruangan.pic = pegawai.id_pegawai ORDER BY id_ruangan DESC`,(err, rows) => {
        console.log(rows)
        if(err){
            req.flash(err)
        }else{
            res.render(`ruangan/index`,{
                data: rows
            })
        }
    });
})

router.get(`/create`, (req,res,next) => {
    connection.query(`SELECT * FROM pegawai ORDER BY id_pegawai DESC`,(err, rows) => {
        if(err){
            req.flash(err)
        }else{
            res.render(`ruangan/create`,{
                data: rows
            })
        }
    });
})

router.post(`/store`, (req,res,next) => {
    let {nama_ruangan, kode_ruangan, pic} = req.body;
    let data = {nama_ruangan, kode_ruangan, pic}
    try {
        connection.query(`insert into ruangan set ?`, data, (err,rows) => {
            if(err){
                console.log(err);
                res.redirect(`/ruangan`)
                return false
            }
            req.flash(`succ`, `Berhasil menambahkan data`)
            res.redirect(`/ruangan`)
        })
    } catch (err) {
        req.flash(`err`, err)
        res.redirect(`/ruangan`)
    }
})

router.get(`/edit/:id`, (req,res,next) => {
    id = req.params.id
    connection.query(`SELECT * FROM ruangan LEFT JOIN pegawai ON ruangan.pic = pegawai.id_pegawai where id_ruangan = ${id}`,(err, rows)=>{
        if(err){
            req.flash(err);
        }else{
            connection.query(`SELECT * FROM pegawai ORDER BY id_pegawai DESC`,(err, data) => {
                if(err){
                    req.flash(err)
                }else{
                    rows = rows[0];
                    console.log(data[0].nama_pegawai);
                    res.render(`ruangan/edit`,{
                        nama : rows.nama_ruangan,
                        kode : rows.kode_ruangan,
                        pic : rows.pic,
                        id : rows.id_ruangan,
                        data,
                    })
                }
            });
        }
    });
})

router.post(`/update/:id`, (req,res,next) => {
    let id = req.params.id
    let {nama_ruangan, kode_ruangan, pic} = req.body
    let data = {nama_ruangan, kode_ruangan, pic}
    try {
        connection.query(`update ruangan set ? where id_ruangan = ${id}`, data, (err,rows) => {
            if(err){
                req.flash(`err`, err);
                res.redirect(`/ruangan`)
                return false
            }
            req.flash(`succ`, `Berhasil mengubah data`)
            res.redirect(`/ruangan`)
        })
    } catch (err) {
        req.flash(`err`, err)
        res.redirect(`/ruangan`)
    }
})

router.get(`/delete/:id`, (req,res,next) => {
    let id = req.params.id
    connection.query(`delete from ruangan where id_ruangan = ${id}`, (err, rows) => {
        if(err){
            console.log(err);
            req.flash(`err`, `query gagal`);
            res.redirect(`/ruangan`)
            return false
        }
        req.flash(`succ`, `Berhasil menghapus data`)
        res.redirect(`/ruangan`)
    })
})

module.exports = router;