const axios = require('axios');
const blueBird = require('bluebird');
const fs = require('fs');

const query = `query($page : Int){
  Page (page:$page, perPage:50){
   	pageInfo{
    	total
      perPage
      currentPage
      lastPage
      hasNextPage
  	} 
  	media (
      type:ANIME,
      isAdult:false,
      popularity_greater:50,
      format:TV,
    	sort:POPULARITY_DESC) {
  	  id
      type
      popularity
      title{
        romaji
        english
        native
      }
      description(asHtml:true)
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      episodes
      
      trailer {
        id
        site
      }
      coverImage {
        extraLarge
        large
        medium
        color
      }
      genres
      averageScore
      tags {
        id
        name
        description
        category
      }
      characters {
        nodes {
          id
          name {
            first
            last
            native
          }
          image {
            large
            medium
          }
          description(asHtml:true)
        }
      }
      studios(isMain:true) {
        nodes {
          name
          siteUrl
        }
      }
      externalLinks {
        url
        site
      }
      reviews (sort:RATING_DESC, page:1, perPage:3){
        nodes {
          id
          summary
          score
          body
        }
      }
  	}
  }
}`;

const asyncScope = async () => {
  const {
    data: {
      data: { Page }
    }
  } = await axios.post('https://graphql.anilist.co', { query: query });

  const { pageInfo } = Page;
  const taskArray = [...Array(pageInfo.lastPage)].map((el, i) => i + 1);
  const result = await blueBird.map(taskArray, el => {
    const variables = {
      page: el
    };
    return axios.post('https://graphql.anilist.co', { query, variables });
  });

  const resultArray = JSON.stringify({
    result: []
      .concat(...result.map(el => el.data.data.Page.media))
      .filter(
        el => el.trailer && el.trailer.site === 'youtube' && el.studios.nodes[0] && el.averageScore
      )
  });

  console.log(resultArray);
  fs.writeFile('result.json', resultArray, console.log);
};

asyncScope().catch(err => {
  console.log('catch', err);
});
