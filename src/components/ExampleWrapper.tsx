// @ts-ignore
import InfiniteLoader from "react-window-infinite-loader"
import { FixedSizeList } from "react-window"

// @ts-ignore
export function ExampleWrapper({ hasNextPage, isNextPageLoading, items, loadNextPage }) {
  // If there are more items to be loaded then add an extra row to hold a loading indicator.
  const itemCount = hasNextPage ? items.length + 1 : items.length;

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;

  // Every row is loaded except for our loading indicator row.
  // @ts-ignore
  const isItemLoaded = index => !hasNextPage || index < items.length;

  // Render an item or a loading indicator.
  // @ts-ignore
  const Item = ({ index, style }) => {
    let content;
    if (!isItemLoaded(index)) {
      content = "Loading...";
    } else {
      content = items[index].name;
    }

    return <div style={style}>{content}</div>;
  };

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <FixedSizeList
          itemCount={itemCount}
          onItemsRendered={onItemsRendered}
          ref={ref}
          height={500}
          width={900}
          itemSize={100}
        >
          {Item}
        </FixedSizeList>
      )}
    </InfiniteLoader>
  );
}