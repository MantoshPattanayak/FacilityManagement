import React, { useEffect, useState } from 'react';

const CheckboxItem = ({ id, label, children, selected, onChange }) => {

  return (
    <div className='items-center p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600'>
      <label className='w-full ml-3 text-sm font-medium text-gray-900 rounded dark:text-gray-300'>
        {
          children && (
            <>
              <input
                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
                type="checkbox"
                value={id}
                checked={selected}
                onChange={onChange}
                disabled
              />
              {label}
            </>)
        }
        {
          !children && (
            <>
              <input
                className='w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
                type="checkbox"
                value={id}
                checked={selected}
                onChange={onChange}
              />
              {label}
            </>
          )
        }
      </label>
      {children && children.length > 0 && (
        <div style={{ marginLeft: '20px' }}>
          {children.map((child) => (
            <CheckboxItem
              key={child.id}
              id={child.id}
              value={child.id}
              label={child.label}
              selected={selected}
              onChange={onChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};


const MultiLevelCheckBox = ({ returnSelectedData, setOpenDropBox, resourceName, recieveValue }) => {

  const [selectedOptions, setSelectedOptions] = useState([]);
  // console.log("Resource Value: ", resourceName);
  const options = [];

  useEffect(() => {
    console.log(selectedOptions);
    previewSelectedOptions();
  }, [selectedOptions])

  //resourceName for coming roleResource data post method.
  //Mapping of Dynamic data.
  resourceName.map((resource, idx) => {
    let obj = {};
    if (!resource.child) { //resource having no child resource
      obj['id'] = resource.parentid;
      obj['label'] = resource.parent;
      options.push(obj);
      // console.log('if parent resource only', options);
    }
    else {
      let parentFound = false;
      // console.log('parent with child',resource);
      // let parent = options.find(item => item.id === resource.parentid);
      for (let i = 0; i < options.length; i++) {
        if (options[i].id == resource.parentid) {
          // console.log('parent found',options[i]);
          let obj1 = {};
          obj1['id'] = resource.childid;
          obj1['label'] = resource.child;

          if (options[i]['children']) { //if child array present
            options[i]['children'] = [...options[i]['children'], obj1];
          }
          else { //if child array not present
            options[i]['children'] = [];
            options[i]['children'].push(obj1);
          }

          parentFound = true;
        }
      }
      if (!parentFound) {
        // console.log('parent not found');
        let obj1 = {};
        obj1['id'] = resource.parentid;
        obj1['label'] = resource.parent;
        options.push(obj1); //parent created

        for (let i = 0; i < options.length; i++) {
          if (options[i].id == resource.parentid) {
            // console.log('parent found',options[i]);
            let obj1 = {};
            obj1['id'] = resource.childid;
            obj1['label'] = resource.child;

            if (options[i]['children']) { //if child array present
              options[i]['children'] = [...options[i]['children'], obj1];
            }
            else { //if child array not present
              options[i]['children'] = [];
              options[i]['children'].push(obj1);
            }

            parentFound = true;
          }
        }
      }
    }
  })

  let temp = options;
  // console.log("temp values", temp);

  // recieveValue(temp);

  //reset the checkbox
  const resetCheckbox = () => {
    const resetData = options.map((parent) => ({
      ...parent,
      children: parent.children.map((child) => ({
        ...child,
        checked: false,
      })),
    }));

    setSelectedOptions(resetData);
    // console.log("reset checkbox: ", selectedOptions);

  }


  const handleCheckboxChange = (event) => {
    const value = event.target.value;

    if (selectedOptions.includes(value)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== value));
      // previewSelectedOptions({data : selectedOptions});
      // console.log("data",{data : selectedOptions});
    } else {
      setSelectedOptions([...selectedOptions, value]);
      // previewSelectedOptions({data : selectedOptions});
    }
  };


  const previewSelectedOptions = (e) => {
    //e.preventDefault();
    console.log(`Selected Options: ${selectedOptions.join(', ')}`);
    // setOpenDropBox(false);
    returnSelectedData({ data: selectedOptions });
  };

  return (
    <>
      <div style={{ overflowY: 'auto', maxHeight: '250px', maxWidth: '' }}>

        {options.map((option) => (
          <CheckboxItem
            key={option.id}
            id={option.id}
            label={option.label}
            // eslint-disable-next-line react/no-children-prop
            children={option.children}
            checked={selectedOptions.includes(option.id.toString())}
            onChange={handleCheckboxChange}
          />
        ))}
      </div>
    </>

  );
};

export default MultiLevelCheckBox;



