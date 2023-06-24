import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import AlbumIcon from '@mui/icons-material/Album';
import { useContext } from 'react'
import {RootCompContext} from "@/pages/_app";
import { Typography } from '@mui/material';
import Link from 'next/link';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
  
export default function PhotoSearchResultList(props) {  
  
  const [searchTerms, setSearchTerms] = React.useState([])  
  
  const {searchTerm, 
    filteredPhotosData, 
    filteredResults, 
    setFilteredResults, 
    maxRecordsReturned, 
    arrowKeyItemIndex, 
    setArrowKeyItemIndex,
    arrowKeyLateralItemIndex, 
    setArrowKeyLateralItemIndex,
    arrowKeyLateralListIndex, 
    setArrowKeyLateralListIndex
 } = useContext(RootCompContext);

  React.useEffect(() => {
    var searchStr = []
    searchStr.push(`${props.searchTerm}`)
    
    setSearchTerms(searchStr)
  }, [props.searchTerm])
  

  const Highlight = ({ children, highlightIndex }) => (
    <strong className="highlighted-text">{children}</strong>
  );
  
  
  return (
    <>   
      {(filteredPhotosData.length > 0 && searchTerm.length > 0) && 
      <>  
      <Typography variant='subtitle1' sx={{mt: 2, ml: 2, color: 'black'}}>
        Photos Search Results
      </Typography>

      <List sx={{ width: '100%', maxWidth: '100%', bgcolor: 'background.paper' }}>
        {filteredPhotosData.slice(0, maxRecordsReturned).map((item, index) => (
          <>
          <ListItemButton
            key={item.id}
            sx={{ mt: 1, py: 0, minHeight: 42, color: 'rgba(5,5,5,.8)', bgcolor: (arrowKeyLateralListIndex === 1 && arrowKeyItemIndex===index) ? '#EFEFEF' : 'background.paper' }}
            onClick={() => props.handleSelectedPhoto(item.id, item.title, item.category)}
          >
          <ListItemAvatar>
             <Avatar alt={item.title} src={item.url} sx={{width: 56, height: 56, mr: 2 }} variant="square"/>
          </ListItemAvatar>
    
            {item.title}
                          
        </ListItemButton>
        </>
        ))}
    </List>
    </>
     }
     </>
  );
}