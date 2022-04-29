# A Buying Frenzy

A solution for restautant task found here https://gist.github.com/seahyc/97b154ce5bfd4f2b6e3a3a99a7b93f69

# Building

### Setup
```
$ git clone https://github.com/NathBabs/restaurant-platform.git
$ cd restaurant-platform
```
  
Create a .env file in the root folder and set the following environment variables <br>


```
DATABASE_URL="postgresql://postgres:postgres@db:5432/buying-frenzy?schema=public"

POSTGRES_USER="postgres"
POSTGRES_PASSWORD="postgres"
POSTGRES_DB="buying-frenzy"
```
### Start Server
```
$ docker-compose up -d
```

### Base Route <br>
 ``https://restaurant-platfrom.herokuapp.com/``

## Routes

### *ETL*

Upload users and restaurants data for ETL. Upload the file as a multipart-form and name it's field as  <br>
restaurants ➜ ***restaurants-data***   ``/buying-frenzy/upload/restaurants``<br>
users ➜ ***users-data***  ``/buying-frenzy/upload/users``<br>

Response
```
{
	"success": true,
	"message": "Restaurants data is being parsed and pushed into the database"
}
```
<br>

### *Search for a restaurant or dish name*

🌍 ➜  ``/buying-frenzy/restaurants?restaurantName=japanese&dishName=chicken`` <br>

Response
```
{
	"success": true,
    "results": [
            {
                "restaurants": [
                    {
                        "id": 1755,
                        "restaurantName": "Genji Japanese Steakhouse - Dublin",
                        "cashBalance": 1093.38,
                        "createdAt": "2022-01-22T15:46:22.257Z",
                        "updatedAt": "2022-01-22T15:46:22.258Z"
                    },
                    {
                        "id": 2256,
                        "restaurantName": "Osaka Japanese Cuisine",
                        "cashBalance": 937.12,
                        "createdAt": "2022-01-22T15:46:23.749Z",
                        "updatedAt": "2022-01-22T15:46:23.750Z"
                    }
                ]
            },
            {
                "dishes": [
                    {
                        "id": 20010,
                        "dishName": "Chicken Turn Overs",
                        "price": 11,
                        "restaurantId": 2670
                    },
                    {
                        "id": 7909,
                        "dishName": "GAI TOM KA: CHICKEN IN COCONUT CREAM SOUP WITH LIME JUICE GALANGA AND CHILI",
                        "price": 10.64,
                        "restaurantId": 1243
                    },
                ]
            }
        ]
}
            
```
<br>

### *Find Y top restaurants that have less/more than X number of dishes between a price range*

🌍 ➜ ``/buying-frenzy/restaurants/lists?noOfRest=9&noOfdishes=10&lowerRange=10&upperRange=25&condition=gt``

```
noOfRest ➜ number of restaurant

noOfdishes ➜  number of dishes

condition ➜  gt(greater than), else it will return restaurants that have less than number of dishes specified

lowerRange ➜  lower range of the price

upperRange ➜  upper range of the price
```

Response

```
{
	"success": true,
	"data": [
		{
			"id": 1566,
			"restaurantName": "Comida - Longmont",
			"cashBalance": 1235.63,
			"createdAt": "2022-01-22T15:46:21.991Z",
			"updatedAt": "2022-01-22T15:46:21.993Z",
			"menu": [
				{
					"id": 10583,
					"dishName": "consomme",
					"price": 10.25,
					"restaurantId": 1566
				},
				{
					"id": 10589,
					"dishName": "Prawns Cooked with Pineapple",
					"price": 10.75,
					"restaurantId": 1566
				}
            ]
        }
    ]
}
```
<br>

###  *Find restaurants that are open at a certain time*

🌍 ➜ ``day=Mon&time=10:00PM``

Response
```
{
	"success": true,
	"data": [
		{
			"id": 1241,
			"restaurantName": "Lazaranda Modern Kitchen & Tequila",
			"cashBalance": 3460.33,
			"createdAt": "2022-01-22T15:46:22.853Z",
			"updatedAt": "2022-01-22T15:46:22.854Z",
			"opening_hours": [
				{
					"id": 8667,
					"restaurantId": 1241,
					"day": "Mon",
					"opens_at": "1970-01-01T10:45:00.000Z",
					"closes_at": "1970-01-01T22:45:00.000Z"
				}
			]
		},
		{
			"id": 1245,
			"restaurantName": "1515 Restaurant",
			"cashBalance": 4841.8,
			"createdAt": "2022-01-22T15:46:21.768Z",
			"updatedAt": "2022-01-22T15:46:21.769Z",
			"opening_hours": [
				{
					"id": 8699,
					"restaurantId": 1245,
					"day": "Mon",
					"opens_at": "1970-01-01T10:00:00.000Z",
					"closes_at": "1970-01-01T22:59:59.999Z"
				}
			]
		}
    ]
}
```
<br>

### *Purchase a dish*
🌎 ➜ ``/buying-frenzy/restaurants/buy``

Allows a user to buy a dish from a restaurant

restId ➜ is the restuarnt's id

menuId ➜ is the id of the dish

userId ➜ is the user's id

Request

```
{
	"restId": 2670,
	"menuId": 20010,
	"userId": 5
}
```

Response
```
{
	"success": true,
	"message": "You have successfully bought this Chicken Turn Overs from The Dredge Restaurant for 11",
	"data": {
		"order": {
			"id": 18617,
			"dishName": "Chicken Turn Overs",
			"restaurantName": "The Dredge Restaurant",
			"transactionAmount": 11,
			"transactionDate": "2022-01-24T00:01:51.000Z",
			"userId": 5,
			"createdAt": "2022-01-24T00:49:37.572Z",
			"updatedAt": "2022-01-24T00:49:37.573Z"
		}
	}
}
```

