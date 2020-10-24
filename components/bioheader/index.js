import { useState, useContext } from "react";
import { UserStateContext } from "../../context/UserContext";
import styles from "./styles.module.scss";
import CloseIcon from "../../images/close.svg";
import * as APIService from "../../services/apis"
import { parseCookies} from 'nookies'

const BioHeader = ({ userData, style, dismissible }) => {

  // const state = useContext(UserStateContext);
  // const userId = state.userId;

  const {token, userId} = parseCookies()

  const [isVisible, setIsVisible] = useState(true);
  const [bioText, setBioText] = useState(userData.bio);
  const [newBioText, setNewBioText] = useState(userData.bio);
  const [bioDisable, setBioDisability] = useState( userId != userData._id);
  const [followingCnt, setFollowingCnt] = useState( userData.following? userData.following.length : 0);
  const [followerCnt, setFollowerCnt] = useState( userData.followers? userData.followers.length : 0);
  const [bFollowing, setBFollowing] = useState( userData.following.indexOf(userId) < 0);

  console.log(userId, userData._id);
  const saveBioText = async () => {
    try {
      await APIService.SaveBioText(JSON.stringify({
        bioText: bioText,
        userId: userId
      }));
      setNewBioText(bioText)
    } catch (err) {
      console.log(err)
    }
  }
  const followUser = async () => {
    try {
      const response = await APIService.UserFollow(JSON.stringify({
        followerId: userId,
        userId:  userData._id
      }));

      const resFollow = await response.json();
      setFollowingCnt(resFollow.following.length)
      console.log("RECEIVED!", followingCnt);
      setBFollowing(false);

      // const cardIndex = cards.map((page) => page._id).indexOf(pageId);
      // const updatedCards = [...cards];
      // updatedCards.splice(cardIndex, 1);
      // setCards(updatedCards);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{ ...style }}
      className={[
        styles.notice,
      ].join(" ")}
    >
      {dismissible && (
        <span
          role="button"
          tabIndex="0"
          className={styles.dismiss}
          onClick={() => setIsVisible(false)} >
          <img src={CloseIcon} alt="close icon" />
        </span>
      )}
      <h4>{userData.name}</h4>
      <div className = {[styles.bioContainer]} >
        {bioDisable ? 
          <input type="text" value={bioText} disabled/> : 
          <input type="text" value={bioText} onChange={e => {
            setBioText(e.target.value);
            } }/>} 
        {!bioDisable && <button onClick={saveBioText}>
          Save
        </button>}
        
        {!bioDisable && <button onClick={ () => {setBioText(newBioText)}}>
          Cancel
        </button>}
      </div>

      <div className = {[styles.followContainer]} >
        <div>
          <p> <span>{followingCnt}</span>Following </p>
          <p> <span>{followerCnt}</span>Followers </p>
        </div>
        {bioDisable && userId && bFollowing && <button onClick={followUser }>
          Follow
        </button>}
      </div>
    </div>
  );
};

export default BioHeader;
