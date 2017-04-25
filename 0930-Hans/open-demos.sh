echo "Are you in the right JOOMMF environment? (CTRL+C to interrupt, RET to continue)"
read
echo "Okay, proceeding..."

open joommf_talk.key

jupyter-notebook standard_problem3.ipynb &
sleep 2

jupyter-notebook micromagneticmodel.ipynb &
sleep 2

jupyter-notebook notebook-demo.ipynb
sleep 2
