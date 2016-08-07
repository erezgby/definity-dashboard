'use strict';

function CrudModelHandler(model) {
    var _model = model;

    var my = {
        model: _model,
    };

    my.create = function(req, res) {
        var doc = req.body;
        _model.create(doc, function(err, doc) {
            if (err) {
                return res.status(500).json({ err: err.message });
            }
            res.json(doc);
        });
    };

    my.getAll = function(req, res) {
        _model.find({}, function(err, docs) {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            res.json(docs);
        });
    };

    my.update = function(req, res) {
        var id = req.params.id;
        var doc = req.body;
        if (doc && doc._id !== id) {
            return res.status(500).json({ err: "Ids don't match!" });
        }
        _model.findByIdAndUpdate(id, doc, {new: true}, function(err, doc) {
            if (err) {
                return res.status(500).json({ err: err.message });
            }
            res.json(doc);
        });
    };

    my.delete = function(req, res) {
        var id = req.params.id;
        _model.findByIdAndRemove(id, function(err, result) {
            if (err) {
                return res.status(500).json({ err: err.message });
            }
            res.json({msg: id + ' Deleted' });
        });
    };
    return my;
}

module.exports = CrudModelHandler;
