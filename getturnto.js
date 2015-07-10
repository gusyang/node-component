//practice q, defer,sync return 
var conf = require("../conf/setting.json");
var http = require("http");
var q = require("q");

function TurnToUGC(){
    if(!(this instanceof TurnToUGC)){
        return new TurnToUGC();
    }
};

TurnToUGC.prototype.getUGCJson = function(item){
    newItem = item || "N82E16817182314";
    var UGCPath = (conf.UGCPath).replace("#siteKey",conf.siteKey).replace("#authKey",conf.authKey).replace("#item",newItem);
    var defer = q.defer();
    var options = {
        host:conf.UGCHost,
        port:conf.UGCPort,
        path:UGCPath
    };
    http.get(options,function(res){
        var buf = "";
        res.on("data",function(d){
            buf += d;
        });
        res.on("error",function(error){
            defer.reject(new Error(error));
        });
        res.on("end", function () {
            try{
                defer.resolve(JSON.parse(buf));
            }catch (err){
                console.log(err);
            }
        })
    }).on("error",function(er){
        console.log(er);
    });
    return defer.promise;
};
module.exports = TurnToUGC;

//test 
/* 
var getturnto = require("getturnto")();
getturnto.getUGCJson(item==="undefined"?null:item)
      .then(function (data) {
      res.render('index', {
          title: 'TurnTo Questions & Answers',
          questions:(data && data.questions)?data.questions:null,
          comments:(data && data.comments)?data.comments:null
      });
  })
      .fail(function(err){
          console.log(err);
          next(err);
      });
 */
