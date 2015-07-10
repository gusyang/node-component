var request = require("request");
var cheerio = require("cheerio");
var redis = require("redis");

process.setMaxListeners(0);
request("http://www.newegg.com",function(err,res,body){
   if(err){
       console.log("request error:",err);
   }else{
       $ = cheerio.load(body);
       var client = redis.createClient();
       var categorylinks = [];
       client.select(1);
       $("a").each(function(){
           var link = $(this);
           var href = link.attr("href");
           if((new RegExp(/(item=)/i).test(href))){
               var item = href.split("=")[1].split("&")[0];
               client.exists(item,function(e,t){
                  if(!t){
                      client.set(item, "http://static.www.turnto.com/sitedata/SZTRUjeBj9oQlLYsite/"+item+
                      "/d/exportjson/oREiGukPubKpciMauth/")
                  }
               });

               //console.log("href= ",href);
           }else{
               var patten =new RegExp(/category\//i);
              if(patten.test(href)) {
                  //console.log("category:", href);
                  categorylinks.push(href);
              }
           }
       });
       client.hset("additionlink","cateogry",{"links":categorylinks});

       client.once("error", function (e) {
           console.log(e);
       });
       client.quit();
   }
}).on("error",function(e){
    console.log(e);
});
process.on("uncaughtException",function(e){
    console.log(e);
})