const customSelect = new CustomSelect(
    ".select",
    {
        main: 'main-class',
        optionItem: "option-class"
    }
);

customSelect.onChange(value => {
    console.log(value);
});

// console.log(customSelect.getValue());
//
// setTimeout(() => {
//     customSelect.setValue('London');
// }, 2000);
