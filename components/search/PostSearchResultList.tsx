import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import People from '@mui/icons-material/People';
import PermMedia from '@mui/icons-material/PermMedia';
import Dns from '@mui/icons-material/Dns';
import Public from '@mui/icons-material/Public';
import { useContext } from 'react'
import { RootCompContext } from "@/pages/_app";
import { Typography } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import Highlighter from "react-highlight-words";
import Link from 'next/link';
  
const data = [
  { icon: <People />, label: 'Authentication' },
  { icon: <Dns />, label: 'Database' },
  { icon: <PermMedia />, label: 'Storage' },
  { icon: <Public />, label: 'Hosting' },
];
  
export default function PostSearchResultList(props) {  
  
  const [searchTerms, setSearchTerms] = React.useState<string[]>([])  
  const {searchTerm, 
         filteredPostsData, 
         maxRecordsReturned, 
         arrowKeyItemIndex,   
         arrowKeyLateralListIndex
      } = useContext(RootCompContext);

  React.useEffect(() => {
    var searchStr: string[] = []
    searchStr.push(`${props.searchTerm}`)
    
    setSearchTerms(searchStr)
  }, [props.searchTerm])
  

  const Highlight = ({ children, highlightIndex }) => (
    <strong className="highlighted-text">{children}</strong>
  );
  
  
  return (
    <>   
      {(filteredPostsData.length > 0 && searchTerm.length > 0) && 
      <>  
        <Typography variant='subtitle1' sx={{mt: 2, ml: 2, color: 'black'}}>
          Post Search Results {arrowKeyItemIndex}
        </Typography>

        <List sx={{ width: '100%', maxWidth: '100%', bgcolor: 'background.paper' }}>
          {filteredPostsData.slice(0, maxRecordsReturned).map((item, index) => (
            <ListItemButton
              key={item.id}
              sx={{ py: 0, minHeight: 42, color: 'rgba(5,5,5,.8)', bgcolor: (arrowKeyLateralListIndex ===0 && arrowKeyItemIndex===index) ? '#EFEFEF' : 'background.paper' }}              
              onClick={() => props.handleSelectedPost(item.id, item.title, item.category)}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
              <MessageIcon/>
              </ListItemIcon> 
      
              <Highlighter
                style={{color: 'black'}}
                highlightClassName={Highlight}
                searchWords={searchTerms}            
                autoEscape={true}
                textToHighlight={item.title}
              />                      
            </ListItemButton>
          ))}
        </List>
      </>
    }
  </>
  );
}