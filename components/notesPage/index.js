import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import Button from "../button";
import EditableBlock from "../editableBlock";
import Notice from "../notice";
import { usePrevious } from "../../hooks";
import { objectId, setCaretToEnd } from "../../utils";
import Card from "../card";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import InboxIcon from '@material-ui/icons/Inbox';
import { makeStyles } from '@material-ui/core/styles';
import ViewListIcon from '@material-ui/icons/ViewList';
import NotesIcon from '@material-ui/icons/Notes';
import BioHeader from "../bioheader";
import { UserStateContext } from "../../context/UserContext";
import * as APIService from "../../services/apis"
import { parseCookies} from 'nookies'
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

const NotesPage = ({ filteredPages, fetchedBlocks, err, userData }) => {
  if (err) {
    return (
      <Notice status="ERROR">
        <h3>Something went wrong 💔</h3>
        <p>Have you tried to restart the app at '/' ?</p>
      </Notice>
    );
  }
  // const state = useContext(UserStateContext);
  // const token = state.token;
  // const userId = state.userId;
  const {token, userId} = parseCookies()

  let bEditable = userId == userData._id;

  const initialPages = filteredPages || [];
  const [cards, setCards] = useState(initialPages.map((data) => data.page));
  const [showInbox, setShowInbox] = useState(true)
  const [showRL, setShowRL] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const router = useRouter();
  const [blocks, setBlocks] = useState(fetchedBlocks);
  const [currentBlockId, setCurrentBlockId] = useState(null);
  const classes = useStyles();
  const prevBlocks = usePrevious(blocks);


  // Update the database whenever blocks change
  useEffect(() => {
    const updatePageOnServer = async (blocks) => {
      try {
        await APIService.PageInfo(userData._id, token, "PUT", JSON.stringify({
          blocks: blocks,
        }))
      } catch (err) {
        console.log(err);
      }
    };
    if (prevBlocks && prevBlocks !== blocks) {
      updatePageOnServer(blocks);
    }
  }, [blocks, prevBlocks]);

  // Handling the cursor and focus on adding and deleting blocks
  useEffect(() => {
    // If a new block was added, move the caret to it
    if (prevBlocks && prevBlocks.length + 1 === blocks.length) {
      const nextBlockPosition =
        blocks.map((b) => b._id).indexOf(currentBlockId) + 1 + 1;
      const nextBlock = document.querySelector(
        `[data-position="${nextBlockPosition}"]`
      );
      if (nextBlock) {
        nextBlock.focus();
      }
    }
    // If a block was deleted, move the caret to the end of the last block
    if (prevBlocks && prevBlocks.length - 1 === blocks.length) {
      const lastBlockPosition = prevBlocks
        .map((b) => b._id)
        .indexOf(currentBlockId);
      const lastBlock = document.querySelector(
        `[data-position="${lastBlockPosition}"]`
      );
      if (lastBlock) {
        setCaretToEnd(lastBlock);
      }
    }
  }, [blocks, prevBlocks, currentBlockId]);

  const handleInbox = () => {
    router.push('/' + userData._id);
  }

  const handleRL = () => {
    router.push('/' + userData._id + "/rlists");
  }

  const handleNotes =  () => {
    router.push('/' + userData._id + "/notes");
  }

  return (
    <>
      <BioHeader style={{ marginBottom: "1rem" }} userData = {userData}/>
        
      <Breadcrumbs separator="/">
        <Link color="inherit" style={{fontSize:"1.1em", cursor:"pointer"}} onClick={handleInbox}>
          <InboxIcon className={classes.icon} />
          Inbox
        </Link>
        
        <Link color="inherit" style={{fontSize:"2em", cursor:"pointer"}} onClick={handleNotes}>
          <NotesIcon className={classes.icon} />
          Notes
        </Link>

        <Link color="inherit" style={{fontSize:"1.1em", cursor:"pointer"}} onClick={handleRL}>
          <ViewListIcon className={classes.icon} />
          Lists
        </Link>

      </Breadcrumbs>

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
              userData={userData}
              deleteCard={(pageId) => deleteCard(pageId)}
            />
          );
        })}
      </div>
      {bEditable && <Button href="/">Add a note</Button>}
    </>
  );
};

export default NotesPage;
