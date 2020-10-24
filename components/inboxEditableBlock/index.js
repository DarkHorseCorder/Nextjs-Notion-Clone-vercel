import ContentEditable from "react-contenteditable";
import { Draggable } from "react-beautiful-dnd";

import styles from "./styles.module.scss";
import ActionMenuInbox from "../actionMenuInbox";
import AddElsewhereMenu from "../addElsewhereMenu";
import DragHandleIcon from "../../images/draggable.svg";
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import { setCaretToEnd, getCaretCoordinates, getSelection } from "../../utils";
import Divider from '@material-ui/core/Divider';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import AddIcon from '@material-ui/icons/Add';
import * as APIService from "../../services/apis"
const CMD_KEY = "/";

// library does not work with hooks
class InboxEditableBlock extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleDragHandleClick = this.handleDragHandleClick.bind(this);
    this.handlePlusClick = this.handlePlusClick.bind(this);
    this.openActionMenu = this.openActionMenu.bind(this);
    this.closeActionMenu = this.closeActionMenu.bind(this);
    this.openTagSelectorMenu = this.openTagSelectorMenu.bind(this);
    this.closeTagSelectorMenu = this.closeTagSelectorMenu.bind(this);
    this.handleTagSelection = this.handleTagSelection.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.addPlaceholder = this.addPlaceholder.bind(this);
    this.calculateActionMenuPosition = this.calculateActionMenuPosition.bind(
      this
    );
    this.calculateTagSelectorMenuPosition = this.calculateTagSelectorMenuPosition.bind(
      this
    );
    this.contentEditable = React.createRef();
    this.fileInput = null;
    this.state = {
      htmlBackup: null,
      html2Backup: null,
      html: "",
      html2: "",
      tag: "p",
      imageUrl: "",
      placeholder: false,
      previousKey: null,
      isTyping: false,
      tagSelectorMenuOpen: false,
      tagSelectorMenuPosition: {
        x: null,
        y: null,
      },
      actionMenuOpen: false,
      actionMenuPosition: {
        x: null,
        y: null,
      },
      displayText: "",
      hostname: "",
    };
  }

  // To avoid unnecessary API calls, the block component fully owns the draft state
  // i.e. while editing we only update the block component, only when the user
  // finished editing (e.g. switched to next block), we update the page as well
  // https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html

  componentDidMount() {
    // Add a placeholder if the first block has no sibling elements and no content
    // this.getMetaData(this.props.html) // we want to get rid of this and just retrieve the data from the stored object id
    const hasPlaceholder = this.addPlaceholder({
      block: this.contentEditable.current,
      position: this.props.position,
      content: this.props.html || this.props.html2 || this.props.imageUrl,
    });
    if (!hasPlaceholder) {
      this.setState({
        ...this.state,
        html: this.props.html,
        html2: this.props.html2,
        tag: this.props.tag,
        imageUrl: this.props.imageUrl,
        displayText: this.props.displayText || this.props.html,
        hostname: this.props.hostname,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // update the page on the server if one of the following is true
    // 1. user stopped typing and the html content has changed & no placeholder set
    // 2. user changed the tag & no placeholder set
    // 3. user changed the image & no placeholder set
    const stoppedTyping = prevState.isTyping && !this.state.isTyping;
    const hasNoPlaceholder = !this.state.placeholder;
    const htmlChanged = this.props.html !== this.state.html;
    const html2Changed = this.props.html2 !== this.state.html2;
    const tagChanged = this.props.tag !== this.state.tag;
    const imageChanged = this.props.imageUrl !== this.state.imageUrl;
    // this.getMetaData(this.props.html)
    if (
      ((stoppedTyping && htmlChanged) || (stoppedTyping && html2Changed) || tagChanged || imageChanged) &&
      hasNoPlaceholder
    ) {
      // this.getMetaData(this.props.html) 
      this.props.updateBlock({
        id: this.props.id,
        tag: this.state.tag,
        html: this.state.html,
        html2: this.state.html2,
        imageUrl: this.state.imageUrl,
        displayText: this.props.displayText,
        protocol: this.state.protocol,
        hostname: this.state.hostname,
        pathname: this.state.pathname,
      });
    } else if (htmlChanged) {
      this.getMetaData(this.state.html).then(() => {
        this.props.updateBlock({
          id: this.props.id,
          tag: this.state.tag,
          html: this.state.html,
          html2: this.state.html2,
          imageUrl: this.state.imageUrl,
          displayText: this.state.displayText,
          protocol: this.state.protocol,
          hostname: this.state.hostname,
          pathname: this.state.pathname,
        });
      })
    }
  }

  componentWillUnmount() {
    // In case, the user deleted the block, we need to cleanup all listeners
    document.removeEventListener("click", this.closeActionMenu, false);
  }

  async getMetaData(url) {
    try {
      console.log("inboxEditableBlock token : ", this.props.token);
      const response = await APIService.PagesUrl(JSON.stringify({
        url: url,
      }), "PUT")
      const data = await response.json().then();
      let settitle = data.title.length < 125 ? data.title : data.title.substring(0, 100) + "...";
      this.setState({
        displayText: settitle,
        hostname: data.hostname,
        protocol: data.protocol,
        pathname: data.pathname,
      });
    } catch ( err ) {
      console.log(err);
    }
  }

  handleChange(e) {
    this.setState({ ...this.state, html: e.target.value, displayText: e.target.value + e.target.value });
  }

  handleCommentChange(e) {
    this.setState({ ...this.state, html2: e.target.value });
  }

  handleFocus() {
    // If a placeholder is set, we remove it when the block gets focused
    if (this.state.placeholder) {
      this.setState({
        ...this.state,
        html: "",
        html2: "",
        placeholder: false,
        isTyping: true,
      });
    } else {
      this.setState({ ...this.state, isTyping: true });
    }
  }

  handleBlur(e) {
    // Show placeholder if block is still the only one and empty
    const hasPlaceholder = this.addPlaceholder({
      block: this.contentEditable.current,
      position: this.props.position,
      content: this.state.html || this.state.html2 || this.state.imageUrl,
    });
    if (!hasPlaceholder) {
      this.setState({ ...this.state, isTyping: false });
    }
  }

  handleKeyDown(e) {
    if (e.key === CMD_KEY) {
      // If the user starts to enter a command, we store a backup copy of
      // the html. We need this to restore a clean version of the content
      // after the content type selection was finished.
      this.setState({ htmlBackup: this.state.html, html2Backup: this.state.html2 });
    } else if (e.key === "Backspace" && !this.state.html) { // add or html2 in here
      this.props.deleteBlock({ id: this.props.id });
    } else if (
      e.key === "Enter" &&
      this.state.previousKey !== "Shift" &&
      !this.state.tagSelectorMenuOpen
    ) {
      // If the user presses Enter, we want to add a new block
      // Only the Shift-Enter-combination should add a new paragraph,
      // i.e. Shift-Enter acts as the default enter behaviour
      e.preventDefault();
      this.getMetaData(this.props.html)
    } else if (
      e.key === "v" &&
      this.state.previousKey !== "Shift" &&
      !this.state.tagSelectorMenuOpen
    ) {
      // e.preventDefault();
      this.getMetaData(this.props.html)
    }
    // We need the previousKey to detect a Shift-Enter-combination
    this.setState({ previousKey: e.key });
  }

  // The openTagSelectorMenu function needs to be invoked on key up. Otherwise
  // the calculation of the caret coordinates does not work properly.
  handleKeyUp(e) {
    if (e.key === CMD_KEY) {
      this.openTagSelectorMenu("KEY_CMD");
    }
  }

  handleMouseUp() {
    const block = this.contentEditable.current;
    const { selectionStart, selectionEnd } = getSelection(block);
    if (selectionStart !== selectionEnd) {
      this.openActionMenu(block, "TEXT_SELECTION");
    }
  }

  handlePlusClick(e) {
    this.props.addBlock({
      id: this.props.id,
      tag: this.state.tag,
      html: this.state.html,
      html2: this.state.html2,
      imageUrl: this.state.imageUrl,
      displayText: this.state.displayText,
      protocol: this.state.protocol,
      ref: this.contentEditable.current,
      hostname: this.state.hostname,
      pathname: this.state.pathname,
    });
  }

  handleDragHandleClick(e) {
    const dragHandle = e.target;
    this.openActionMenu(dragHandle, "DRAG_HANDLE_CLICK");
  }

  openActionMenu(parent, trigger) {
    const { x, y } = this.calculateActionMenuPosition(parent, trigger);
    this.setState({
      ...this.state,
      actionMenuPosition: { x: x, y: y },
      actionMenuOpen: true,
    });
    // Add listener asynchronously to avoid conflicts with
    // the double click of the text selection
    setTimeout(() => {
      document.addEventListener("click", this.closeActionMenu, false);
    }, 100);
  }

  closeActionMenu() {
    this.setState({
      ...this.state,
      actionMenuPosition: { x: null, y: null },
      actionMenuOpen: false,
    });
    document.removeEventListener("click", this.closeActionMenu, false);
  }

  openTagSelectorMenu(trigger) {
    const { x, y } = this.calculateTagSelectorMenuPosition(trigger);
    this.setState({
      ...this.state,
      tagSelectorMenuPosition: { x: x, y: y },
      tagSelectorMenuOpen: true,
    });
    document.addEventListener("click", this.closeTagSelectorMenu, false);
  }

  closeTagSelectorMenu() {
    this.setState({
      ...this.state,
      htmlBackup: null,
      tagSelectorMenuPosition: { x: null, y: null },
      tagSelectorMenuOpen: false,
    });
    document.removeEventListener("click", this.closeTagSelectorMenu, false);
  }

  // Convert editableBlock shape based on the chosen tag
  // i.e. img = display <div><input /><img /></div> (input picker is hidden)
  // i.e. every other tag = <ContentEditable /> with its tag and html content
  handleTagSelection(tag) {
    if (tag === "img") {
      this.setState({ ...this.state, tag: tag }, () => {
        this.closeTagSelectorMenu();
        if (this.fileInput) {
          // Open the native file picker
          this.fileInput.click();
        }
        // Add new block so that the user can continue writing
        // after adding an image
        this.props.addBlock({
          id: this.props.id,
          html: "",
          html2: "",
          tag: "p",
          imageUrl: "",
          ref: this.contentEditable.current,
          hostname: "",
        });
      });
    } else {
      if (this.state.isTyping) {
        // Update the tag and restore the html backup without the command
        this.setState({ tag: tag, html: this.state.htmlBackup, html2: this.state.html2Backup }, () => {
          setCaretToEnd(this.contentEditable.current);
          this.closeTagSelectorMenu();
        });
      } else {
        this.setState({ ...this.state, tag: tag }, () => {
          this.closeTagSelectorMenu();
        });
      }
    }
  }

  async handleImageUpload() {
    if (this.fileInput && this.fileInput.files[0]) {
      const pageId = this.props.pageId;
      const imageFile = this.fileInput.files[0];
      const formData = new FormData();
      formData.append("image", imageFile);
      try {
        const response = await APIService.PageImgUpload(formData, pageId)
        const data = await response.json();
        const imageUrl = data.imageUrl;
        this.setState({ ...this.state, imageUrl: imageUrl });
      } catch (err) {
        console.log(err);
      }
    }
  }

  // Show a placeholder for blank pages
  addPlaceholder({ block, position, content }) {
    const isFirstBlockWithoutHtml = !content;
    if (isFirstBlockWithoutHtml) {
      this.setState({
        ...this.state,
        html: "Enter Article URL here",
        html2: "Comment",
        tag: "p",
        imageUrl: "",
        placeholder: true,
        isTyping: false,
        hostname: "",
        pathname: "",
        protocol: "",
        displayText: "",
      });
      return true;
    } else {
      return false;
    }
  }

  // If we have a text selection, the action menu should be displayed above
  // If we have a drag handle click, the action menu should be displayed beside
  calculateActionMenuPosition(parent, initiator) {
    switch (initiator) {
      case "TEXT_SELECTION":
        const { x: endX, y: endY } = getCaretCoordinates(false); // fromEnd
        const { x: startX, y: startY } = getCaretCoordinates(true); // fromStart
        const middleX = startX + (endX - startX) / 2;
        return { x: middleX, y: startY };
      case "DRAG_HANDLE_CLICK":
        const x =
          parent.offsetLeft - parent.scrollLeft + parent.clientLeft - 90;
        const y = parent.offsetTop - parent.scrollTop + parent.clientTop + 35;
        return { x: x, y: y };
      default:
        return { x: null, y: null };
    }
  }

  // If the user types the "/" command, the tag selector menu should be display above
  // If it is triggered by the action menu, it should be positioned relatively to its initiator
  calculateTagSelectorMenuPosition(initiator) {
    switch (initiator) {
      case "KEY_CMD":
        const { x: caretLeft, y: caretTop } = getCaretCoordinates(true);
        return { x: caretLeft, y: caretTop };
      case "ACTION_MENU":
        const { x: actionX, y: actionY } = this.state.actionMenuPosition;
        return { x: actionX - 40, y: actionY };
      default:
        return { x: null, y: null };
    }
  }

  render() {
    console.log("EDITABLE:", this.props.bEditable);
    const clsName = this.props.bEditable ? "" : styles.userDisable;
    return (
      <div className={clsName}>
        {this.state.tagSelectorMenuOpen && (
          <AddElsewhereMenu
            position={this.state.tagSelectorMenuPosition}
            closeMenu={this.closeTagSelectorMenu}
            handleSelection={this.handleTagSelection}
          />
        )}
        {this.state.actionMenuOpen && (
          <ActionMenuInbox
            position={this.state.actionMenuPosition}
            actions={{
              deleteBlock: () => this.props.deleteBlock({ id: this.props.id }),
              turnInto: () => this.openTagSelectorMenu("ACTION_MENU"),
            }}
          />
        )}
        <Draggable draggableId={this.props.id} index={this.props.position}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              className={styles.draggable}
              {...provided.draggableProps}
            >
              {this.state.tag !== "img" && (
                <>
                <h3 className={styles.articleTitle} ><a href={`${this.state.html}`} target="_blank">{this.props.displayText.substring(0, 100)}</a></h3>

                {/* article URL - contenteditable */}
                <ContentEditable
                  innerRef={this.contentEditable}
                  data-position={this.props.position}
                  data-tag={this.state.tag}
                  html={this.props.displayText == "" ? this.props.html : this.props.hostname} // why is hostname undefined for a short period
                  disabled={this.props.displayText != ""}
                  onChange={this.handleChange}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                  onKeyDown={this.handleKeyDown}
                  onKeyUp={this.handleKeyUp}
                  onMouseUp={this.handleMouseUp}
                  tagName={this.state.tag}
                  className={[
                    styles.articleURL,
                    (this.state.isTyping ||
                    this.state.actionMenuOpen ||
                    this.state.tagSelectorMenuOpen) && 
                    this.state.displayText == ""
                      ? styles.blockSelected
                      : null,
                    this.state.placeholder ? styles.placeholder : null,
                    snapshot.isDragging ? styles.isDragging : null,
                  ].join(" ")}
                />
                {/* comment - contenteditable */}
                <ContentEditable
                  html={this.state.html2}
                  onChange={this.handleCommentChange}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                  onKeyDown={this.handleKeyDown}
                  onKeyUp={this.handleKeyUp}
                  onMouseUp={this.handleMouseUp}
                  tagName={this.state.tag}
                  className={[
                    styles.block,
                    this.state.isTyping ||
                    this.state.actionMenuOpen ||
                    this.state.tagSelectorMenuOpen
                      ? styles.blockSelected
                      : null,
                    this.state.placeholder ? styles.placeholder : null,
                    snapshot.isDragging ? styles.isDragging : null,
                  ].join(" ")}
                />
                </>
              )}
              {this.state.tag === "img" && (
                <div
                  data-position={this.props.position}
                  data-tag={this.state.tag}
                  ref={this.contentEditable}
                  className={[
                    styles.image,
                    this.state.actionMenuOpen || this.state.tagSelectorMenuOpen
                      ? styles.blockSelected
                      : null,
                  ].join(" ")}
                >
                  <input
                    id={`${this.props.id}_fileInput`}
                    name={this.state.tag}
                    type="file"
                    onChange={this.handleImageUpload}
                    ref={(ref) => (this.fileInput = ref)}
                    hidden
                  />
                  {!this.state.imageUrl && (
                    <label
                      htmlFor={`${this.props.id}_fileInput`}
                      className={styles.fileInputLabel}
                    >
                      No Image Selected. Click To Select.
                    </label>
                  )}
                  {this.state.imageUrl && (
                    <img
                      src={
                        process.env.NEXT_PUBLIC_API + "/" + this.state.imageUrl
                      }
                      alt={/[^\/]+(?=\.[^\/.]*$)/.exec(this.state.imageUrl)[0]}
                    />
                  )}
                </div>
              )}

              <span
                role="button"
                tabIndex="0"
                className={styles.dragHandle}
                onClick={this.handleDragHandleClick}
                {...provided.dragHandleProps}
              >
                <img src={DragHandleIcon} alt="Icon" />
                
              </span>

              <span
                role="button"
                tabIndex="0"
                className={styles.dragHandle}
                onClick={this.handlePlusClick}
                {...provided.dragHandleProps}
              >
                <AddIcon className={styles.plusHandle} />
              </span>
              <Divider className={styles.divider}/>
            </div>
            
          )}
        </Draggable>
      </div>
    );
  }
}

export const getServerSideProps = async (context) => {
  const myCookies = nookies.get(context)
  const { token, userId } = myCookies;
  return {
    props: { token, userId }
  };
};
export default InboxEditableBlock;
