# React Pokemon Team Builder

A simple pokedex based on [BrianC's design](https://dribbble.com/shots/2901787-Pokemon-OG).

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Table of Contents

## Stack
  * [request](https://github.com/request/request) (simplified http requests)
  * [pokeapi](https://github.com/PokeAPI/pokeapi) (formatted pokemon data)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.


## Notes

Please be aware that the api only allows for 100 calls per minute from any IP address (not counting images). If the application is not returning any results, wait a minute and then try again. (Did not implement resource caching yet!!!)

Try not to turn on the debugger when viewing. The application sends requests out in bursts to retrieve data of individual pokemon. For example, when selecting a region filter alongside 2 type filters, a request for the region information and 2 requests for the respective type information are sent out. Our current request count is now 3. The moment these complete, 10 more are sent out to resolve the first 10 pokemon to be displayed. 13 requests are sent out extremely quickly, meaning that with the debugger on, there will be a noticeable decrease in performance.

## Todo

* Resource Caching (or at least better ways of structuring it)

### Design (Data Structure)

Because this is the first time I've interacted with the pokemon dataset, I had not yet thought about how data for individual pokemon were structured. For example, an individual pokemon can have multiple forms (e.g. Alolan Ninetales and Mega Charizard). While mega evolutions can share movesets with an individual pokemon variant, regional variants can have differing movesets. Megas and variants each also have their own types (e.g. Gyrados -> Water Flying, Mega Gyrados -> Water Dark).

Because I wanted to implement the type filter, It was best to handle both megas and and regional variants under a single umbrella term, variants. Each variant has its name, typing, and can be associated with a region, making it best singular unit of data to design data structures around.


### Design (Architecture)








