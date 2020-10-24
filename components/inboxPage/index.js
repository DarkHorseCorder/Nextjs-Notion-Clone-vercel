import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import Button from "../../components/button";
import EditableBlock from "../editableBlock";
import InboxEditableBlock from "../inboxEditableBlock";
import BioHeader from "../bioheader";
import Notice from "../notice";
import { usePrevious } from "../../hooks";
import { objectId, setCaretToEnd } from "../../utils";
import Card from "../../components/card";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import InboxIcon from '@material-ui/icons/Inbox';
import { makeStyles } from '@material-ui/core/styles';
import ViewListIcon from '@material-ui/icons/ViewList';
import NotesIcon from '@material-ui/icons/Notes';
import ContentEditable from "react-contenteditable";
import styles from "./styles.module.scss";
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
const InboxPage = ({  pageIdList, 
  filteredPages, 
  userData, 
  err }) => {
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
  const {token, userId} = parseCookies()

  let bEditable = userId == userData._id;
  console.log(userId, userData._id, bEditable);

  const initialPages = filteredPages || [];
  const [cards, setCards] = useState(initialPages.map((data) => data.page));
  const [showInbox, setShowInbox] = useState(true)
  const [showRL, setShowRL] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const router = useRouter();
  const [blocks, setBlocks] = useState(userData.inboxBlocks);
  const [currentBlockId, setCurrentBlockId] = useState(null);
  const classes = useStyles();
  const contentEditable = React.createRef();
  const prevBlocks = usePrevious(blocks);
  let block1 = blocks[0];

  // Update the database whenever blocks change
  useEffect(() => {
    const updatePageOnServer = async (blocks) => {
      try {
        await APIService.UserAccountInbox(token, "PUT", JSON.stringify({
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

  const deleteImageOnServer = async (imageUrl) => {
    // The imageUrl contains images/name.jpg, hence we do not need
    // to explicitly add the /images endpoint in the API url
    try {
      const response = await APIService.PageInfo(imageUrl, token, "DELETE")
      await response.json();
    } catch (err) {
      console.log(err);
    }
  };

  const updateBlockHandler = (currentBlock) => {
    const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
    const oldBlock = blocks[index];
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: currentBlock.tag,
      html: currentBlock.html,
      html2: currentBlock.html2,
      imageUrl: currentBlock.imageUrl,
      displayText: currentBlock.displayText,
      protocol: currentBlock.protocol,
      hostname: currentBlock.hostname,
      pathname: currentBlock.pathname,
    };
    setBlocks(updatedBlocks);
    // If the image has been changed, we have to delete the
    // old image file on the server
    if (oldBlock.imageUrl && oldBlock.imageUrl !== currentBlock.imageUrl) {
      deleteImageOnServer(oldBlock.imageUrl);
    }
  };

  const addBlockHandler = (currentBlock) => {
    setCurrentBlockId(currentBlock.id);
    const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
    
    const updatedBlocks = [...blocks];
    const newBlock =  {  
                        _id: objectId(), 
                        tag: "p",
                        html: "",
                        html2: "",
                        imageUrl: "",
                        displayText:"",
                        protocol: "" 
                      };
    updatedBlocks.splice(index + 1, 0, newBlock);
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: currentBlock.tag,
      html: currentBlock.html,
      html2: currentBlock.html2,
      imageUrl: currentBlock.imageUrl,
      displayText: currentBlock.displayText,
      protocol: currentBlock.protocol,
      hostname: currentBlock.hostname,
      pathname: currentBlock.pathname,
    };
    setBlocks(updatedBlocks);
  };

  const deleteBlockHandler = (currentBlock) => {
    if (blocks.length > 1) {
      setCurrentBlockId(currentBlock.id);
      const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
      const deletedBlock = blocks[index];
      const updatedBlocks = [...blocks];
      updatedBlocks.splice(index, 1);
      setBlocks(updatedBlocks);
      // If the deleted block was an image block, we have to delete
      // the image file on the server
      if (deletedBlock.tag === "img" && deletedBlock.imageUrl) {
        deleteImageOnServer(deletedBlock.imageUrl);
      }
    }
  };

  const onDragEndHandler = (result) => {
    const { destination, source } = result;

    // If we don't have a destination (due to dropping outside the droppable)
    // or the destination hasn't changed, we change nothing
    if (!destination || destination.index === source.index) {
      return;
    }

    const updatedBlocks = [...blocks];
    const removedBlocks = updatedBlocks.splice(source.index - 1, 1);
    updatedBlocks.splice(destination.index - 1, 0, removedBlocks[0]);
    setBlocks(updatedBlocks);
  };

  const handleInbox = () => {
    console.log("USERDATA: " + userData._id);
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
      <BioHeader 
        style={{ marginBottom: "1rem" }} 
        userData = {userData} />

      <Breadcrumbs separator="/">
        <Link color="inherit" style={{fontSize:"2em", cursor:"pointer"}} onClick={handleInbox}>
          <InboxIcon />
          Inbox
        </Link>
        <Link color="inherit" style={{fontSize:"1.1em", cursor:"pointer"}} onClick={handleNotes}>
          <NotesIcon />
          Notes
        </Link>
        <Link color="inherit" style={{fontSize:"1.1em", cursor:"pointer"}} onClick={handleRL}>
          <ViewListIcon />
          Lists
        </Link>
      </Breadcrumbs>
      <br></br>
      <DragDropContext onDragEnd={onDragEndHandler}>
        <Droppable droppableId={userData._id}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {blocks.map((block) => {
                const position =
                  blocks.map((b) => b._id).indexOf(block._id) + 1;
                return (
                  <InboxEditableBlock
                    key={block._id}
                    position={position}
                    id={block._id}
                    tag={block.tag}
                    html={block.html}
                    html2={block.html2}
                    imageUrl={block.imageUrl}
                    displayText={block.displayText}
                    protocol={block.protocol}
                    hostname={block.hostname}
                    pathname={block.pathname}
                    pageId={userData.userId}
                    addBlock={addBlockHandler}
                    deleteBlock={deleteBlockHandler}
                    updateBlock={updateBlockHandler}
                    bEditable={bEditable}
                  />
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <br></br>
    </>
  );
};

export default InboxPage;
