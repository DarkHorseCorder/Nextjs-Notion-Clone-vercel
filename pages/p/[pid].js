import { resetServerContext } from "react-beautiful-dnd";
import nookies from 'nookies'
import * as APIService from "../../services/apis"

import EditablePage from "../../components/editablePage/index";

const Page = ({ pid, creatorid, blocks, err }) => {
  return <EditablePage id={pid} creatorid={creatorid} fetchedBlocks={blocks} err={err} />;
};

export const getServerSideProps = async (context) => {
  const myCookies = nookies.get(context)
  const { token } = myCookies;
  resetServerContext(); // needed for drag and drop functionality
  const pageId = context.query.pid;
  const res = context.res;
  try {
    if ( !pageId ){
      console.log("?????????????", pageId);
      res.writeHead(302, { Location: `/login` });
      res.end(); 
      return {props: {}} 
    }
    const response = await APIService.PageInfo(pageId, token, "GET")
    const data = await response.json();
    let creatorid = "";
    if (data.page && data.page.creator)
      creatorid = data.page.creator.toString();
    return {
      props: { blocks: data.page.blocks, pid: pageId, creatorid: creatorid, err: false },
    };
  } catch (err) {
    console.log(err);
    return { props: { blocks: null, pid: 100, creatorid: null, err: true } };
  }
};

export default Page;
