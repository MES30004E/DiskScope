'use strict';
const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
function selectTab(tab, focus = false, updateURL = true) {
  for (const item of tabs) {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  }
  if (updateURL) {
    const url = new URL(window.location.href);
    url.searchParams.set('view', tab.id.replace('tab-', ''));
    history.replaceState(null, '', url);
  }
  if (focus) tab.focus();
}
for (const tab of tabs) {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', event => {
    const index = tabs.indexOf(tab);
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectTab(tabs[next], true); }
  });
}

const requestedView = new URLSearchParams(window.location.search).get('view');
const restoredTab = tabs.find(tab => tab.id === `tab-${requestedView}`);
if (restoredTab) selectTab(restoredTab, false, false);
