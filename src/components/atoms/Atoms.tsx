export const RequiredMark =() => {
  return<span className="text-base text-subBlue ml-1">*</span>
}

export const PageTitle = ({title}) => {
  return (
    <h2 className="text-center mt-16 mb-2 text-xl text-gray-900">
      {title}
    </h2>
  );
}
