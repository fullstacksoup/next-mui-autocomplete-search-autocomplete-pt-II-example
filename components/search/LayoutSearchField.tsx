import * as React from "react";
import { useContext, useRef } from "react";
import {RootCompContext} from "@/pages/_app";
import { alpha, styled } from '@mui/material/styles';
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { Box, Stack } from "@mui/material";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import { useRouter } from 'next/router'
import SearchResultsGrid from "./SearchResultsGrid";
import DialogShowRecord from "./DialogShowRecord";

const Search = styled('div')(({ theme }) => ({
  position: 'relative',

  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {    
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none',
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '80ch',
    },
  },
}));

const SearchClearIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  right: 1,
  cursor: 'pointer',
  zIndex: 99,
}));

interface IPhotoRecord { 
  id: number,
  title: string, 
  category: string  
} 


interface IPostRecord { 
  id: number,
  title: string, 
  category: string  
} 


export default function LayoutSearchField(props) {
  const router = useRouter()
  var searchInputRef = useRef<HTMLInputElement>();
  const [showRecordDialog, setShowRecordDialog] = React.useState<boolean>(false);
  const [showResults, setShowResults] = React.useState(false);
  
  const [chosenRecord, setChosenRecord] = React.useState<IPhotoRecord | undefined>(undefined);
  const {
    searchTerm,
    setSearchTerm,        
    postsData,
    photosData,    
    setFilteredPostsData,    
    filteredPostsData,    
    setFilteredPhotosData,
    setFilteredResultsCategories,
    arrowKeyItemIndex, 
    setArrowKeyItemIndex, 
    setSelectProduct
  } = useContext(RootCompContext);
       
  const arrowUpPressed = useKeyPress('ArrowUp');
  const arrowDownPressed = useKeyPress('ArrowDown');
  // const arrowLeftPressed = useKeyPress('ArrowLeft');
  // const arrowRightPressed = useKeyPress('ArrowRight');
  const enterKeyPressed = useKeyPress('Enter');
  const [ counter, setCounter ] = React.useState(0);
  const [ displaySearchTerm, setDisplaySearchTerm ] = React.useState('');
  const [ isTraverList, setIsTraverList ] = React.useState(false);

  //*  U P   A N D   D O W N   A R R O W S    P R E S S E D 
  
  React.useEffect(() => {
    if (arrowUpPressed) {
      console.log('arrowUpPressed');
      if(arrowKeyItemIndex > 0) {
        setCounter(counter - 1)        
        const index = arrowKeyItemIndex - 1;
        setArrowKeyItemIndex(arrowKeyItemIndex - 1);        
      }
      setDisplaySearchTerm(filteredPostsData[arrowKeyItemIndex].title)
      // setSearchTerm(filteredPostsData[arrowKeyItemIndex].title)
    }
  }, [arrowUpPressed]);

  React.useEffect(() => {
    if (arrowDownPressed) {

      if(arrowKeyItemIndex <= filteredPostsData.length-2) {
        setCounter(counter + 1)
        const index = arrowKeyItemIndex + 1;
        setArrowKeyItemIndex(arrowKeyItemIndex + 1);
      }      
      setDisplaySearchTerm(filteredPostsData[arrowKeyItemIndex].title)
     // setSearchTerm(filteredPostsData[arrowKeyItemIndex].title)
    }
  }, [arrowDownPressed]);

  React.useEffect(() => {
    if (enterKeyPressed) {   
      const { id, title } = filteredPostsData[arrowKeyItemIndex]      
      setChosenRecord(filteredPostsData[arrowKeyItemIndex])
      setDisplaySearchTerm(title);
      setSearchTerm(title);
      setShowResults(false);            
      setShowRecordDialog(true)
      // router.push(`/product/${id}`)
    }
  }, [enterKeyPressed]);
  
  const handleCloseRecordDialogBox = () => {
     setShowRecordDialog(false)
  }
   
  //*  H A N D L E   S E L E C T   P H O T O    R E C O R D 
  
  const handleSelectedPhoto = (id, title, category) => {
    
    const chosenRecord: IPhotoRecord = { 
      id: id, 
      title: title, 
      category: category
    } 
    console.log('handleSelectedPhoto', chosenRecord)
    setChosenRecord(chosenRecord)
    setShowRecordDialog(true)
    
  }
  
  //*  H A N D L E   S E L E C T   P H O T O    R E C O R D 

  const handleSelectedPost = (id, title, category) => {
    
    const chosenRecord: IPhotoRecord = { 
      id: id, 
      title: title, 
      category: category
    } 
    console.log('handleSelectedPhoto', chosenRecord)
    setChosenRecord(chosenRecord)
    setShowRecordDialog(true)
    
  }

  
  //*  O T H E R   K E Y S   P R E S S E D 
  
  React.useEffect(() => {
    setArrowKeyItemIndex(0)
  }, [searchTerm]);

 
  //*  H A N D L E   S E A R C H   T E R M   C H A N G E D
  
  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);

    // Make sure results are showing when typing
    if(showResults === false) {
      setShowResults(true);        
    }
    
    const tmpPostsData: IPostRecord[] = [];    
    const tmpPhotosData: IPhotoRecord[]  = [];
    const tmpCategoriesData: any  = [];

    if (e.target.value.length > 0) {      
      
      postsData.forEach((element) => {
        if (
          element.title
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        ) {

          tmpPostsData.push(element);

          if(!tmpCategoriesData.includes(element.category)){
            tmpCategoriesData.push(element.category)
          }          
        }
      });

      photosData.forEach((element) => {
        if (
          element.title
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        ) {
          tmpPhotosData.push(element);
          if(!tmpCategoriesData.includes(element.category)){
            tmpCategoriesData.push(element.category)
          }
        }
      });    
      
      setFilteredResultsCategories(tmpCategoriesData)
      setFilteredPostsData(tmpPostsData.splice(0, 9));
      setFilteredPhotosData(tmpPhotosData);        
    }

  };
  
  //*  H A N D L E   O P E N   /   S H O W    S E A R C H
  
  const handleOpenSearchResults = () => {    
    setShowResults(true);
  };

   
  //*  H A N D L E   S E L E C T   P R O D U C T   W I T H   M O U S E   C L I C K 

  const handleSelectedProduct = (id) => {
    setSelectProduct(id);
    setShowResults(false);    
//    router.push(`/product/${handle}`)
  
  };  
  
  //*  H A N D L E   C L E A R   S E A R C H   T E R M   C H A N G E D
    
  const handleClearSearchTerm = (e) => {
    setSearchTerm('');
    setDisplaySearchTerm('')
    setFilteredPostsData([]);
    setFilteredPhotosData([]);  
    searchInputRef.current.focus();
  };

  return (
    <>
      <Box
        alignContent="center"        
        sx={{  position: "absolute", top: "1vh", left: "20vw", zIndex: 99 }}
      >
        <ClickAwayListener onClickAway={() => setShowResults(false)}>
          <Box textAlign="left" sx={{ width: "50vw", position: "relative" }}>
            <Stack spacing={0}>
              <Search>
                 <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <SearchClearIconWrapper >
                  {searchTerm.length > 0 && 
                    <ClearIcon onClick={(e) => handleClearSearchTerm(e)}/>
                  }
                </SearchClearIconWrapper>
                <StyledInputBase
                  inputRef={(input) => { searchInputRef.current = input }}
                  size="small"
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search Products"
                  inputProps={{ "aria-label": "search google maps" }}
                  onChange={(e) => handleSearchTerm(e)}
                  onFocus={() => handleOpenSearchResults()}
                  value={searchTerm}
                />
              </Search>
              
              <SearchResultsGrid
                handleSelectedPhoto={handleSelectedPhoto}
                handleSelectedPost={handleSelectedPost}
                showResults={showResults}
                searchTerm={searchTerm}                
                handleSelectedProduct={handleSelectedProduct}
              />
            </Stack>
          </Box>
        </ClickAwayListener>
      </Box>
      {chosenRecord &&
      <DialogShowRecord data={chosenRecord} 
                        handleClose={handleCloseRecordDialogBox}
                        open={showRecordDialog}/>
      }
    </>
  );
}



//*  C U S T O M   H O O K   T O   H A N D L E   K E Y B O A R D   E V E N T S


const useKeyPress = (targetKey) => {
  const [keyPressed, setKeyPressed] = React.useState(false);

  React.useEffect(() => {
    const downHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    };

    const upHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]);

  return keyPressed;
};