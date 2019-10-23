// name: set-form-data
// outputs: 1
msg.headers = {
    "content-type" : 'multipart/form-data'
};

let databuffer = msg.payload;

msg.payload = {
    "cover-image": {
        "value": databuffer,
        "options": {
            "filename": "cover-image.png"
        }
    }
};

return msg;