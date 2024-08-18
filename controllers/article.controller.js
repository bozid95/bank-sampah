import Article from "../models/article.model.js";
import User from "../models/user.model.js";

const getAll = async (req, res) => {
  try {
    const articles = await Article.findAll({
      include: [
        {
          model: User,
          attributes: ["Name"],
        },
      ],
    });
    return res.status(200).json({
      success: true,
      message: "Articles found",
      data: articles,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const getOne = async (req, res) => {
  const article = await Article.findByPk(req.params.id);
  if (!article) {
    return res.status(404).json({
      success: false,
      message: "Article not found",
    });
  }
  try {
    const article = await Article.findByPk(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Article found",
      data: article,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const createArticle = async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: "Title and content are required",
    });
  }
  try {
    const article = await Article.create({
      Title: title,
      Content: content,
      include: [
        {
          model: User,
          attributes: ["Name"],
        },
      ],
    });
    return res.status(201).json({
      success: true,
      message: "Article created successfully",
      data: article,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const updateArticle = async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: "Title and content are required",
    });
  }
  const article = await Article.findByPk(req.params.id);
  if (!article) {
    return res.status(404).json({
      success: false,
      message: "Article not found",
    });
  }
  try {
    const article = await Article.update(
      {
        Title: title || article.Title,
        Content: content || article.Content,
      },
      {
        where: {
          ArticleID: req.params.id,
        },
      }
    );
    return res.status(200).json({
      success: true,
      message: "Article updated successfully",
      data: article,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const deleteArticle = async (req, res) => {
  const article = await Article.findByPk(req.params.id);
  if (!article) {
    return res.status(404).json({
      success: false,
      message: "Article not found",
    });
  }
  try {
    const article = await Article.destroy({
      where: {
        ArticleID: req.params.id,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Article deleted successfully",
      data: article,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
export { getAll, getOne, createArticle, updateArticle, deleteArticle };
