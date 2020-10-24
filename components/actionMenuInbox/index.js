import styles from "./styles.module.scss";
import TrashIcon from "../../images/trash.svg";
import ArchiveIcon from '@material-ui/icons/Archive';
import DeleteIcon from '@material-ui/icons/Delete';

const MENU_WIDTH = 150;
const MENU_HEIGHT = 40;

const ActionMenuInbox = ({ position, actions }) => {
  let x = position.x - MENU_WIDTH / 2;
  let y = position.y - MENU_HEIGHT - 10;

  return (
    <div
      className={styles.menuWrapper}
      style={{
        top: y,
        left: x,
      }}
    >
      <div className={styles.menu}>
        <span
          id="turn-into"
          className={styles.menuItem}
          role="button"
          tabIndex="0"
          onClick={actions.turnInto}
        >
          Add to reading list
        </span>
        <ArchiveIcon 
          className={styles.archiveItem}
          onClick={() => console.log("archive")}
        />

        <DeleteIcon 
          id="delete"
          className={styles.archiveItem}
          onClick={actions.deleteBlock}
        />
        
      </div>
    </div>
  );
};

export default ActionMenuInbox;
