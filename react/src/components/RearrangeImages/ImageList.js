import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const type = 'Image'; // Need to pass which type element can be draggable

const Image = ({ image, index, moveImage }) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: type,
    hover(item) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Move the content
      moveImage(dragIndex, hoverIndex);
      // Update the index for dragged item directly to avoid flickering when half dragged
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type, id: image.url ? image.url : image.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // initialize drag and drop into the element
  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0 : 1 }}
      className="file-item"
    >
      {image.url ? (
        <img alt={`img - ${image.url}`} src={image.url} className="file-img" />
      ) : (
        <div>
          <p>{image.content}</p>
        </div>
      )}
    </div>
  );
};

const ImageList = ({ images, moveImage }) => {
  const renderImage = (item, index) => {
    if (item.metatype == 'image') {
      return (
        <Image
          image={item}
          index={index}
          key={`${item.url}-image`}
          moveImage={moveImage}
        />
      );
    } else if (item.metatype == 'text') {
      return (
        <Image image={item} index={index} key={item.id} moveImage={moveImage} />
      );
    }
  };

  return <section className="file-list">{images.map(renderImage)}</section>;
};

export default ImageList;
