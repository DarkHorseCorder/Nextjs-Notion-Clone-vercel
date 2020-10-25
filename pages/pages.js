import { useState, useContext } from "react";
import Card from "../components/card";
import Button from "../components/button";
import Notice from "../components/notice";
import { UserStateContext } from "../context/UserContext";
import * as APIService from "../services/apis"
import nookies from 'nookies'

const PagesPage = ({ pages }) => {
  const initialPages = pages || [];
  const [cards, setCards] = useState(initialPages.map((data) => data.page));

  const deleteCard = async (pageId) => {
    try {
      await APIService.PageInfo(pageId, token, "DELETE")
      const cardIndex = cards.map((page) => page._id).indexOf(pageId);
      const updatedCards = [...cards];
      updatedCards.splice(cardIndex, 1);
      setCards(updatedCards);
    } catch (err) {
      console.log("DELETE CARD ERROR: ", err);
    }
  };
  return (
    <>
      <h1 className="pageHeading">Your Reading Lists</h1>
      <div id="pageList">
        {cards.length === 0 && (
          <Notice style={{ marginBottom: "2rem" }}>
            <h3>Let's go!</h3>
            <p>Seems like you haven't created any pages so far.</p>
            <p>How about starting now?</p>
          </Notice>
        )}
        {cards.map((page, key) => {
          const updatedAtDate = new Date(Date.parse(page.updatedAt));
          const pageId = page._id;
          const blocks = page.blocks;
          return (
            <Card
              key={key}
              pageId={pageId}
              date={updatedAtDate}
              content={blocks}
              deleteCard={(pageId) => deleteCard(pageId)}
            />
          );
        })}
      </div>
      <Button href="/">Create A New Page</Button>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const myCookies = nookies.get(context)
  const { token } = myCookies;

  const res = context.res;

  if (!token) {
    res.writeHead(302, { Location: `/login` });
    res.end();
    return {props: {}} 
  }

  try {
    const response = await APIService.GetPages(token, "GET")
    const data = await response.json();
    const pageIdList = data.pages;
    const pages = await Promise.all(
      pageIdList.map(async (id) => {
        const response = await APIService.PageInfo(id, token, "GET")
        return await response.json();
      })
    );
    const filteredPages = pages.filter((page) => !page.errCode);
    return { props: { pages: filteredPages } };
  } catch (err) {
    console.log(err);
    return { props: {} };
  }
};

export default PagesPage;
