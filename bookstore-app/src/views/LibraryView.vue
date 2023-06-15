<template>
    <RouterView 
      @afterSubmit="() => $router.push('/books')" />
  </template>