import React from 'react';
import Image from 'next/image';

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <Image src={`/Image/AppSom.gif`} alt="Loading" width={500} height={500} className="object-contain -my-20"/>
    </div>
  );
};

export default Loading;
