import React, { ReactNode, FC } from 'react';

interface EachProps<T> {
  render: (item: T, index: number) => ReactNode;
  of: T[];
}

const Each: FC<EachProps<any>> = ({ render, of }) =>
  React.Children.toArray(
    of.map((item, index) => render(item, index))
  );

export default Each;
