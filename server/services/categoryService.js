const models = require('../models/index');

exports.getAllCategories = async (name) => {
  let res;
  if (name) {
    res = await models.Category.find({ name }).populate('Category');
  } else {
    res = await models.Category.find({});
  }

  return res;
};

exports.getCategoryByName = async (name) => {
  let category;
  try {
    // findOne함수에서 자채적으로 없으면 에러를 throw 한다.
    category = await models.Category.findOne({ name });
  } catch (error) {
    // 디비쪽 문제일때 에러처리는 여기서..
    throw new Error(`Unhandled type: ${name}`);
  }

  // 찾는 이름이 없는 경우
  if (category === null) {
    return null;
  }

  return category.name;
};

exports.createCategory = async ({ name }) => {
  try {
    await models.Category.create({ name });
    return `${name} 카테고리 생성 성공`;
  } catch (err) {
    throw new Error(`${name}라는 이름이 이미 존재합니다.`);
  }
};

exports.updateCategory = async (_id, name) => {
  try {
    await models.Category.updateOne({ _id }, { name });
  } catch (error) {
    throw new Error(error);
  }
};

exports.deleteCategory = async (_id) => {
  try {
    const result = await models.Category.findOneAndDelete({ _id });

    return result.name;
  } catch (err) {
    throw new Error('해당 카테고리가 존재하지 않습니다.');
  }
};
