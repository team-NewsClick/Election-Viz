# Election-Viz

[![Netlify Status](https://api.netlify.com/api/v1/badges/b1fe2eb7-d510-4352-b955-a37d521f3cd4/deploy-status)](https://app.netlify.com/sites/elections-viz/deploys)

A web-app to visualize Indian General and Assembly elections. It has an interactive map and a dashboard with options where one can make custom alliances, apply swings and compare election results on a selected region and seats.

## Environment Variables

Place the environment variables in **.env** file in the root of the project folder. Please refer **.env.example** for example.

Following are the environment variables used in the project:
- Mapbox Access Token: This can be obtained by signing in to [Mapbox](https://www.mapbox.com).
- Live Election's Link: A link through which data for live election's result can be accessed.

## Getting Started

- First, install all the **node_modules** 

  ```bash
  npm install
  #or
  yarn install
  ```

- Secondly, run the development server:

  ```bash
  npm run dev
  # or
  yarn dev
  ```

- Open [http://localhost:3000/elections](http://localhost:3000/) from the browser to see the result.

## Deployement

While deploying on netlify:
- Publish directory should be **.next**.
- Provide environment variable on netlify.

Please refer to the [Netlify Blog post](https://www.netlify.com/blog/2020/11/30/how-to-deploy-next.js-sites-to-netlify/) for more information 

## License

AGPL-3.0 License
