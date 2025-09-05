type PageHeaderProps = {
  title: string;
  subtitle: string;
};

const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
  return (
    <header className="text-center mb-6 lg:mb-8 px-2">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
        {title}
      </h1>
      <p className="text-sm sm:text-base lg:text-lg text-gray-600 px-4">
        {subtitle}
      </p>
    </header>
  );
};

export default PageHeader;