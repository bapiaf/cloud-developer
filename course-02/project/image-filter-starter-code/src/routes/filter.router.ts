import { Router, Request, Response } from 'express';
import {
  filterImageFromURL,
  deleteLocalFiles,
  validateImageURL,
} from '../util/util';

const router: Router = Router();

// @TODO1 IMPLEMENT A RESTFUL ENDPOINT
// GET /filteredimage?image_url={{URL}}
// endpoint to filter an image from a public url.
// IT SHOULD
//    1
//    1. validate the image_url query
//    2. call filterImageFromURL(image_url) to filter the image
//    3. send the resulting file in the response
//    4. deletes any files on the server on finish of the response
// QUERY PARAMATERS
//    image_url: URL of a publicly accessible image
// RETURNS
//   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

/**************************************************************************** */
router.get('/', async (req: Request, res: Response) => {
  const files: Array<string> = [''];

  try {
    //  1. validate that the URL query is a valid image URL
    //console.log('checking if ' + req.query.image_url + 'is valid');
    const isValidImageURL = await validateImageURL(req.query.image_url);
    //console.log(isValidImageURL);

    if (isValidImageURL == false) {
      res.status(400).send('not a valid image URL');
    } else {
      //  2. call filterImageFromURL to filter the image
      //console.log('filtering ' + req.query.image_url);
      const filteredImagePath = await filterImageFromURL(req.query.image_url);

      //  3. send the resulting filtered file in the response
      //and 4. delete any files on the server on finish of the response
      //console.log('sending filteredfile ' + filteredImagePath);
      files[0] = filteredImagePath;
      //console.log(files);
      res.status(200);

      res.sendFile(filteredImagePath, (result) => {
        //console.log('response sent. Deleting local files');
        deleteLocalFiles(files);
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

//! END @TODO1

export const FilterRouter: Router = router;
