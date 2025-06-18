const express=require('express');
const cors=require('cors');
const axios=require('axios');
require('dotenv').config();

const app=express();
const PORT=5000;

app.use(cors());

app.get('/api/weather',async(req,res)=>
{
  const city=req.query.city;
  if(!city){
    return res.status(400).json({error:'City is required'});
  }
  try{
    const weather=await axios.get(`https://api.openweathermap.org/data/2.5/weather`,
      {
        params:{
          q:city,
          appid:process.env.OPENWEATHER_API_KEY,
          units:'metric',

        },
      }

);
 const data = weather.data;

    res.json({
      temperature: data.main.temp,
      description: data.weather[0].description,
      main: data.weather[0].main,
      humidity: data.main.humidity,
      wind:data.wind.speed,
      city: data.name,
      country: data.sys.country,
    });
  } catch (error) {
    console.error('Weather API error:', error.message);
    res.status(500).json({ error: 'Could not fetch weather data' });
  }
});
app.get('/api/restaurants',async(req,res)=>
{ const city = req.query.city;
  const Key = process.env.GEOAPIFY_KEY;

console.log("Geoapify key:", process.env.GEOAPIFY_KEY);

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }
  try{
    const geores=await axios.get('https://api.geoapify.com/v1/geocode/search',{
      params:{
        text:city,
        apiKey:Key,
      },
    });
    const location = geores.data.features[0].geometry.coordinates;
    const lon = location[0];
    const lat = location[1];

    const places=await axios.get('https://api.geoapify.com/v2/places',{
      params:{
        categories:'catering.restaurant',
        apiKey:Key,
        filter:`circle:${lon},${lat},5000`,
        limit:10,
      },
    });

    const restdata=places.data.features.map((place)=>({
      name:place.properties.name,
      postcode:place.properties.postcode,
      address:place.properties.formatted,
    }));

    res.json(restdata);
  }catch(error){
    console.error('Geoapify error:',error.message);
    res.status(500).json({error:'Error in Server'});
  }
});

app.get('/api/school',async(req,res)=>
{ const city = req.query.city;
  const Key = process.env.GEOAPIFY_KEY;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }
  try{
    const geores=await axios.get('https://api.geoapify.com/v1/geocode/search',{
      params:{
        text:city,
        apiKey:Key,
      },
    });
    const location = geores.data.features[0].geometry.coordinates;
    const lon = location[0];
    const lat = location[1];

    const places=await axios.get('https://api.geoapify.com/v2/places',{
      params:{
        categories:'education.school',
        apiKey:Key,
        filter:`circle:${lon},${lat},5000`,
        limit:10,
      },
    });

    const restdata=places.data.features.map((place)=>({
      name:place.properties.name,
      postcode:place.properties.postcode,
      address:place.properties.formatted,
    }));

    res.json(restdata);
  }catch(error){
    console.error('Geoapify error:',error.message);
    res.status(500).json({error:'Error in Server'});
  }
});

app.get('/api/hospital',async(req,res)=>
{ const city = req.query.city;
  const Key = process.env.GEOAPIFY_KEY;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }
  try{
    const geores=await axios.get('https://api.geoapify.com/v1/geocode/search',{
      params:{
        text:city,
        apiKey:Key,
      },
    });
    const location = geores.data.features[0].geometry.coordinates;
    const lon = location[0];
    const lat = location[1];

    const places=await axios.get('https://api.geoapify.com/v2/places',{
      params:{
        categories:'healthcare',
        apiKey:Key,
        filter:`circle:${lon},${lat},5000`,
        limit:10,
      },
    });

    const restdata=places.data.features.map((place)=>({
      name:place.properties.name,
      postcode:place.properties.postcode,
      address:place.properties.formatted,
    }));

    res.json(restdata);
  }catch(error){
    console.error('Geoapify error:',error.response?.data||error.message);
    res.status(500).json({error:'Error in Server'});
  }
});


app.listen(PORT, ()=> {
  console.log(`Server running on ${PORT}`);
});
