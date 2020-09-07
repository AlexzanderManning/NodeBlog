const getSiteContent = async (req, res, db, id) => {
  try {
    const data = await db.select("*").from("site_content").where("id", "=", id);
    const content = await data[0];
    const response = content;
    return response;
  } catch (error) {
    res.status(400).json("Content does not exist in database.");
  }
};


module.exports = {
  getSiteContent
}