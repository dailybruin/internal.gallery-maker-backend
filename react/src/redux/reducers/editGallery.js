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
        metatype: 'image';
        url: string;
        caption: string;
      ] // i think?
      || 
      [
        metatype: 'text';
        content: string;
        id: string;
      ];
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
      
      if (state.layout === action.payload)
        return state 
      let newGallery = state.gallery.map((img) => ({
        ...img,
        type: galleryOptions[action.payload][0],
      }));
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
    case 'CREATE_TEXTBOX': {
      //payload: {index: number, location: string}
      let newGallery = state.gallery;
      let previousIndex;
      if (action.payload.location == 'first') previousIndex = 0; // Workaround for the first textbox
      let i = 1;
      if (typeof previousIndex === 'undefined') {
        for (let item of state.gallery) {
          if (item.metatype == 'image' && item.url == action.payload.location) {
            previousIndex = i;
            break;
          } else if (
            item.metatype == 'text' &&
            item.id == action.payload.location
          ) {
            previousIndex = i;
            break;
          } else i++;
        }
      }
      if (typeof previousIndex === 'undefined') return state;
      newGallery.splice(previousIndex, 0, {
        metatype: 'text',
        content: '',
        id: action.payload.id,
      });
      return {
        ...state,
        gallery: newGallery,
      };
    }
    case 'EDIT_TEXTBOX': {
      //payload: {newText: string, id: string}
      let newGallery = state.gallery.map((item, index) => {
        if (action.payload.id == item.id)
          return {
            ...item,
            content: action.payload.newText,
          };
        return item;
      });

      return {
        ...state,
        gallery: newGallery,
      };
    }
    case 'DELETE_TEXTBOX': {
      //payload: {id: string}
      let newGallery = state.gallery.filter(
        (item) => item.id != action.payload.id
      );
      // newGallery.splice(action.payload.index, 1);
      console.log('redux newGallery (new state after delete)', newGallery);
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
      };
    }

    default: {
      return state;
    }
  }
};

export default editGallery;
