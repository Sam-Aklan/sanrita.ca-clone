const CreativeStudio = () => {
  return (
    <div className="creative-studio mobile:grid mobile:self-end mobile:col-2 mobile:row-4 mobile:relative mobile:px-0 pl-2 mobile:-translate-x-(--scroll-aside-title-translate-x) mobile:translate-y-(--scroll-aside-title-translate-y) translate-0 text-left   ">
      <h1 className="col-1 row-1 font-f37stout mobile:text-h1-like text-h3-like text-forest-green mobile:flex mobile:flex-col uppercase mobile:[clip-path:inset(0px_calc(var(--scroll-aside-title))_0px_0px)] [clip-path:inset(0px_100%_0px_0px)] hidden">
        <p>A creative studio</p>
        <p>where brands and</p>
        <p>stories move off-trails</p>
      </h1>

      <h1 className="col-1 row-1 font-f37stout mobile:text-h1-like text-h3-like text-adventure-yellow flex flex-col uppercase mobile:[clip-path:inset(0px_0px_0px_calc(var(--scroll-aside-width)-var(--scroll-aside-title)))] [clip-path:inset(0px)]">
        <p>A creative studio</p>
        <p>where brands and</p>
        <p>stories move off-trails</p>
      </h1>
    </div>
  );
};

export { CreativeStudio };
