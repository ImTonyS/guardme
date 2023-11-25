COMANDOS DE GIT

Para eliminar datos de una branch sin borrarlos de local
 git rm -r --cached "register" "register copy" 

Para actualizar carpetas especificas de otras branches
git checkout source_branch -- path/to/specific_folder
git add path/to/specific_folder
git commit -m "Merge specific folder from source_branch"
git push...