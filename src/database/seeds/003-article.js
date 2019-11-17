import { createItem } from '../query/helper';

const articles = [
  {
    id: "9c291e0d-5183-40dc-9c8c-20be7dd70479",
    ownerId: '11111',
    title: 'Working on Node',
    article: 'some very long article',
    authorName: 'John doe',
    share: true,
    coverImageUrl: "https://testimg"
  },
  {
    id: "0a598563-5a38-4f8d-9cb7-482103559ad6",
    ownerId: '11111',
    title: 'What is testing',
    article: 'some very long article',
    authorName: 'John doe',
    share: true,
    coverImageUrl: "https://testimg"
  },
  {
    id: "59403e37-5ea7-44b0-9606-bafe179f6e05",
    ownerId: '11112',
    title: 'Best way to code',
    article: 'some very long article',
    authorName: 'John doe',
    share: true,
    coverImageUrl: "https://testimg"
  }
]

export default () => {
  articles.forEach(async (article) => {
    const { error } = await createItem('articles', article);
    if (error) throw new Error(error);
  });
};