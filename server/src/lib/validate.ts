const validateName = (name: string): boolean => {
	if (name.length > 10) return false;
	const re = new RegExp(/^[0-9a-zA-Z]+$/);
	return re.test(name);
}

export { validateName }