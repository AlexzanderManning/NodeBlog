const getPosts = async (req, res, db) => {
  try {
    const data = await db.select("*").from("posts");
    const content = await data;
    const response = content;
    return response;
  } catch (error) {
    res.status(400).json("Content does not exist in database.");
  }
};

const fetchPost = async (req, res, db, id) => {
  try {
    const data = await db.select("*").from("posts").where("post_id", '=', id);
    const content = await data[0];
    const response = content;
    return response;
  } catch (error) {
    res.status(400).json("Post does not exist in database.");
  }
};

const composePost = async (res, req, post, knex) => {
  
  // try {
  //   console.log(post);
  //   db("posts").insert({
      
  //   });
  // } catch (error) {
  //   console.log(error);
  // }

  try {
    await knex.transaction(async (trx) => {
        await trx("posts").insert(
        {
          post_title: post.post_title,
          post_content: post.post_content,
        }
      );

      

      console.log("New post saved.");
    });
  } catch (error) {
    // If we get here, that means that neither the 'Old Books' catalogues insert,
    // nor any of the books inserts will have taken place.
    console.error(error);
  }
  
}

module.exports = {
  getPosts,
  fetchPost,
  composePost
};
