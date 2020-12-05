const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Message = require("../models/Message");
const cron = require("node-cron");
const axios = require("axios");

/* uncommment line 9 and 10 as well as in router file*/

//exports.createSMS = asyncHandler(async (req, res, next) => {
//const { dnis, message } = req.body;

//toSend();
var datext = [];
async function toSend() {
  smsObj = {
    dnis: "0132393211, 0132593233",
    message: "testing 6",
  };
  //var datext = [];

  axios
    .post("http://kr8tif.lawaapp.com:1338/api", smsObj)
    .then(async function (response) {
      //console.log(response.data);
      //console.log(response.config.data);
      var tt = response.data;
      var txtmsg = smsObj.message;
      tt.forEach((i) => {
        i.message = txtmsg;
        datext.push(i);
      });

      // var ts = await axios.get("http://kr8tif.lawaapp.com:1338/api", {
      //   params: {
      //     messageId: datext[0].message_id,
      //   },
      // });
      // console.log(ts);
      getUser(datext);
      console.log("success");
      console.log(datext);
      //res.status(200).json({ data: datext });
    })
    .catch(function (error) {
      console.error(error);
      //return next(new ErrorResponse("error calling api"), 400);
    });
}
//const messageRecord = await Message.create(smsObj);
//});

async function getUser(data) {
  // data.forEach((x) => {
  //   console.log(x.message_id);
  // });

  var txt = [];
  var params;
  var msgstatus = [];

  try {
    data.forEach(async (x) => {
      //console.log(data[0].message_id)
      params = {
        params: {
          messageId: x.message_id,
        },
      };

      txt.push(axios.get("http://kr8tif.lawaapp.com:1338/api", params));
      //.then((data) => console.log(data));
    });

    Promise.all(txt)
      .then((responses) => {
        responses.forEach((response) => {
          const { status, delivery_time } = response.data;
          console.log(status);
          if (status == "ACCEPTD") {
            getUser(data);
            throw new Error("error");
          }
          msgstatus.push(status);
        });
      })

      .then(async function () {
        for (let i = 0; i < data.length; i++) {
          //console.log("msg", msgstatus[i]);
          //console.log("dont go here if true");
          data[i].status = msgstatus[i];
        }
        //   console.log(txt.length);
        console.log(data);

        const messageRecord = await Message.create(data);
        datext = [];
        txt = [];
        // console.log(messageRecord);
      })
      .catch((err) => console.log("error is", err));
  } catch (error) {
    console.error(error);
  }
}

cron.schedule("* * * * *", function () {
  console.log("running scheduler");
  toSend();
});
