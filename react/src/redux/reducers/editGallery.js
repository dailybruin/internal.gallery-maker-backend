import { galleryOptions } from 'constants/galleryLayouts';

const initialState = {
  gallery: [],
  name: '',
  description: '',
  layout: 'alt',
};
/*
    gallery: 
      [
        url: string;
        caption: string;
      ]; // i think?
      name: string;
      layout: string;
      description: string;
  */

const editGallery = (state = initialState, action) => {
  switch (action.type) {
    case 'EDIT_GALLERY': {
      return {
        ...state,
        gallery: action.payload,
      };
    }
    case 'DELETE_GALLERY': {
      return initialState;
    }
    case 'REMOVE_GALLERY_IMAGE': {
      let newGallery = state.gallery.filter(
        (img) => img.url !== action.payload
      );
      return {
        ...state,
        gallery: newGallery,
      };
    }
    case 'RESET_GALLERY': {
      return initialState;
    }
    case 'EDIT_DESCRIPTION': {
      return {
        ...state,
        description: action.payload,
      };
    }
    case 'EDIT_NAME': {
      return {
        ...state,
        name: action.payload,
      };
    }
    case 'EDIT_LAYOUT': {
      let newGallery = state.gallery.map((img) => ({
        ...img,
        type: galleryOptions[action.payload][0]
      }))
      return {
        ...state,
        gallery: newGallery,
        layout: action.payload,
      };
    }
    case 'EDIT_CAPTION': {
      // payload: {url: blah, newCaption: stuff}
      let newGallery = state.gallery.map((img) => {
        if (img.url === action.payload.url)
          return {
            ...img,
            caption: action.payload.newCaption,
          };
        return img;
      });

      return {
        ...state,
        gallery: newGallery,
      };
    }
    case 'EDIT_CREDIT': {
      // payload: {url: blah, newCredit: stuff}
      // url identifies which image we are editing
      let newGallery = state.gallery.map((img) => {
        if (img.url === action.payload.url)
          return {
            ...img,
            credits: action.payload.newCredit,
          };
        return img;
      });

      return {
        ...state,
        gallery: newGallery,
      };
    }

    case 'EDIT_TYPE': {
      let newGallery = state.gallery.map((img) => {
        if (img.url === action.payload.url) {
          return {
            ...img,
            type: action.payload.newType,
          };
        }
        return img;
      });
      
      return {
        ...state,
        gallery: newGallery,
      }
    }

    default: {
      return state;
    }
  }
};

export default editGallery;
