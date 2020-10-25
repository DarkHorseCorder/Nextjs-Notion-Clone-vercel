import { useState } from "react";
import nookies from 'nookies'
import Card from "../components/card";
import Button from "../components/button";
import Notice from "../components/notice";
import InboxIcon from '@material-ui/icons/Inbox';
import NotesIcon from '@material-ui/icons/Notes';
import ViewListIcon from '@material-ui/icons/ViewList';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import EditablePage from "../components/editablePage/index";
import InboxPage from "../components/inboxPage/index";
import { useRouter } from "next/router";
import { resetServerContext } from "react-beautiful-dnd";
import * as APIService from "../services/apis"

const PagesPage = ({ profileid, pages, inbox, pid, creatorid, blocks }) => {
  const initialPages = pages || [];
  inbox = inbox || [];
  const [cards, setCards] = useState(initialPages.map((data) => data.page));
  const [showInbox, setShowInbox] = useState(true)
  const [showRL, setShowRL] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const classes = useStyles();
  const router = useRouter();

  const publicprofile= "/user/" + profileid;

  const deleteCard = async (pageId) => {
    try {
      await APIService.PageInfo(pageId, token, "DELETE")
      const cardIndex = cards.map((page) => page._id).indexOf(pageId);
      const updatedCards = [...cards];
      updatedCards.splice(cardIndex, 1);
      setCards(updatedCards);
    } catch (err) {
      console.log(err);
    }
  };

  function handleRL() {
    setShowRL(true)
    setShowNotes(false)
    setShowInbox(false)
  }

  let handleNotes = async () => {
    console.log("handleNotes")
    setShowRL(false)
    setShowNotes(true)
    setShowInbox(false)
  }

  function handleInbox() {
    setShowRL(false)
    setShowNotes(false)
    setShowInbox(true)
  }

  return (
    <>
      <h1 className="pageHeading">Profile</h1>
     
      <Breadcrumbs separator="/">
        <Link color="inherit" onClick={handleInbox}>
          <InboxIcon className={classes.icon} />
          Inbox
        </Link>
        <Link color="inherit" onClick={handleRL}>
          <ViewListIcon className={classes.icon} />
          Lists
        </Link>
        <Link color="inherit" onClick={handleNotes}>
          <NotesIcon className={classes.icon} />
          Notes
        </Link>

      </Breadcrumbs>

      {
        showRL ? 
        <div>
        <div id="pageList">
        {cards.length === 0 && (
          <Notice style={{ marginBottom: "2rem" }}>
            <h3>Let's go!</h3>
            <p>Seems like you haven't created any pages so far.</p>
            <p>How about starting now?</p>
          </Notice>
        )}
        <h3 className="profileHeading"> Reading Lists </h3>
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
      <Button href="/">Create A New Reading List</Button>
      </div>
      : <div></div>
      }

      {
        showInbox ? 
        <div id="pageList">
        <h3 className="profileHeading"> Inbox </h3>
        {inbox.length === 0 && (
          <Notice style={{ marginBottom: "2rem" }}>
            <h3>Let's go!</h3>
            <p>Your inbox is empty.</p>
            <p>Add new reading items here or via the browser extension</p>
          </Notice>
        )}
        <InboxPage id={pid} creatorid={creatorid} fetchedBlocks={blocks} err={null} />;
      </div>
      : <div></div>
      }

      {
      showNotes ? 
      <div>
      This yo notes
      </div>
      : <div></div>
      }

      
    </>
  );
};

export const getServerSideProps = async (context) => {
  const myCookies = nookies.get(context)
  const { token } = myCookies;
  
  resetServerContext(); // needed for drag and drop functionality
  const res = context.res;
  const req = context.req;

  if (!token) {
    res.writeHead(302, { Location: `/login` });
    res.end();
    return {props: {}}
  }

  try {
    let pageId = '602022a58db47aa19778b687';
    const response1 = await 
    fetch(
      `${process.env.NEXT_PUBLIC_API}/pages/${pageId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data1 = await response1.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/pages`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response2 = await fetch(
      `${process.env.NEXT_PUBLIC_API}/users/account`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    const data2 = await response2.json();
    const pageIdList = data.pages;
    const pages = await Promise.all(
      pageIdList.map(async (id) => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/pages/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return await response.json();
      })
    );
    const filteredPages = pages.filter((page) => !page.errCode);
    return { props: { profileid: data2._id, pages: filteredPages, blocks: data1.page.blocks, pid: pageId, creatorid: data1.page.creator.toString(), inbox: data2.inbox } };
  } catch (err) {
    console.log(err);
    return { props: {} };
  }
};

const useStyles = makeStyles((theme) => ({
  link: {
    display: 'flex',
    paddingBottom: 20,
  },
  icon: {
    marginRight: theme.spacing(0.5),
    paddingTop: 5,
    width: 25,
    height: 25,
  },
  bc: {
    paddingTop: 10,
    paddingBottom: 10,
  }
}));

export default PagesPage;
