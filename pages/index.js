import EditablePage from "../components/editablePage";
import * as APIService from "../services/apis"
import * as MyCookies from "../services/manage_cookie"
import nookies from 'nookies'

// If a user hits "/", we create a blank page and redirect to that page
// so that each user gets his/her personal space to test things

const IndexPage = ({ pid, blocks, err }) => {
  return <EditablePage id={pid} fetchedBlocks={blocks} err={err} />;
};

export const getServerSideProps = async (context) => { 
  const myCookies = nookies.get(context)
  const { token } = myCookies;
  
  console.log("INDEX PAGE COOKIE: ", myCookies);

  const blocks = [{ tag: "p", html: "", imageUrl: "" }];
  const res = context.res;
  try {
    if (!token){
      res.writeHead(302, { Location: `/login` });
      res.end(); 
      return {props: {}} 
    }
    const response = await APIService.GetPages(token, "POST", JSON.stringify({
      blocks: blocks,
    }))
    
    const data = await response.json();
    const pageId = data.pageId;
    const creator = data.creator?data.creator: null;
    const query = !creator ? "?public=true" : ""; // needed to show notice
    if ( !pageId){
      res.writeHead(302, { Location: `/users` });
      res.end();
      return { props: {} };
    } else {
      MyCookies.setCookieWithPath(myCookies, `/p/${pageId}`);
      res.writeHead(302, { Location: `/p/${pageId}${query}` });
      res.end();
      return { props: {pid: 100} };
    }
  } catch (err) {
    console.log(err);
    return { props: { blocks: null, pid: 100, err: true } };
  }
};

export default IndexPage;
