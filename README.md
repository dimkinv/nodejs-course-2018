# Group Shopping Application
Server base url: localhost:3000
# Endpoints
## Get all items 
`GET /items`

Response
```
200 OK
{
  items: [
    {
      ...item details
    }
  ]
}
```

## Create new offer
`POST /items`

headers:
```
{
  X-AUTH: attuid
}
```

body:
```
{

}
```

Response:
```
201 Created
{
  ...itemdetails + id
}
```

## Delete offer
`DELETE /items/:id`
headers:
```
{
  X-AUTH: attuid
}
```

Response:
```
204 No content
```

## Join purchase 
`PUT /items/:id`
headers:
```
{
  X-AUTH: attuid
}
```
Response:
```
200 OK
```

## Cancel Joining
`DELETE /items/:id`
headers:
```
{
  X-AUTH: attuid
}
```

Response:
```
204 No content
```

# Modules excercise

## Modules 1
- Create basic nodejs project

## Module 2
- in-memory endpoints

## Module 3 
- implement persistance interface
- move in-memory api to file system
- wrap fs callback with async api

## Module 4 
- move persistant api to MongoDB

## Module 5 
- broadcast all users when item is added/removed to the list
- broadcast when someone click +1/-1 on item

## Module 6 

- write unit tests to project

## Module 7
- publish app with pm2