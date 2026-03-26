export default function decorate(block) {
    const blockContent = block.querySelector(':scope > div > div');
    while (blockContent.firstElementChild) block.append(blockContent.firstElementChild);    
    blockContent.parentElement.remove();
}