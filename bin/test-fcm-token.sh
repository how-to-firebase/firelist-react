curl -i -H 'Content-type: application/json' -H 'Authorization: key={key}' -XPOST https://fcm.googleapis.com/fcm/send -d '{
  "registration_ids":["{id}"],
  "notification": {
      "title":"Title of your notification",
      "body":"content of your notification"
  },
  "data": {
    "noteId" : "1234",
    "title" : "testing testing",
    "message" : "one two three"
  }
}'