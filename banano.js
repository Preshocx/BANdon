const bananojs = require('bananojs');
bananojs.setBananodeApiUrl('https://kaliumapi.appditto.com/api');

async function send_banano(addr, amount) {
  try {
    await bananojs.sendBananoWithdrawalFromSeed(process.env.seed, 0, addr, amount);
    return true;
  } catch (e) {
    return false;
  }
}

async function get_account_history(addr) {
  return await bananojs.getAccountHistory(addr, -1);
}

async function check_bal(addr) {
  let raw_bal = await bananojs.getAccountBalanceRaw(addr);
  let bal_parts = await bananojs.getBananoPartsFromRaw(raw_bal);
  return bal_parts.banano
}

async function faucet_dry() {
  let bal = await check_bal("ban_3tn9xt9sxbyw9injikki3yis5fbn6m47x37gco5cw6e6x6z7z4639cdgzke6");
  if (Number(bal) < 1) {
    return true;
  }
  return false;
}

function address_related_to_blacklist(account_history, blacklisted_addresses) {
  if (account_history.history) {
    for (let i=0; i < account_history.history.length; i++) {
      if (account_history.history[i].type == "send" && blacklisted_addresses.includes(account_history.history[i].account)) {
        return true
      }
    }
  }
  return false
}

async function is_unopened(address) {
  let account_history = await bananojs.getAccountHistory(address, -1);
  if (account_history.history == '') {
    return true
  }
  return false
}
 
async function recieve_deposits() {
	//await bananojs.receiveNanoDepositsForSeed(process.env.seed, 0, await bananojs.getNanoAccountFromSeed(process.env.seed, 0));
  await bananojs.receiveBananoDepositsForSeed(process.env.seed, 0, await bananojs.getBananoAccountFromSeed(process.env.seed, 0));
}

async function isProducingMicroPayments(address){
  let account_history = await bananojs.getAccountHistory(address, 100);
  micro=0
  for (let i=0; i < account_history.history.length; i++) {
    if (account_history.history[i].amount*(10**-29) < 0.009){
      micro+=1;
    }
  }
  return micro/account_history.history.length
}

module.exports = {
  send_banano: send_banano,
  faucet_dry: faucet_dry,
  check_bal: check_bal,
  recieve_deposits: recieve_deposits,
  address_related_to_blacklist: address_related_to_blacklist,
  is_unopened: is_unopened,
  get_account_history: get_account_history,
  isProducingMicroPayments: isProducingMicroPayments
}
